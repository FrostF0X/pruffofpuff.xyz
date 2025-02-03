// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Update OpenZeppelin imports to version ^4.0.0
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// SignatureVerifier contract provided by the user
contract SignatureVerifier {
    // Function to split the signature into v, r, and s components
    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Invalid signature length"); // Check if signature is 65 bytes

        assembly {
            r := mload(add(sig, 32))  // First 32 bytes
            s := mload(add(sig, 64))  // Second 32 bytes
            v := byte(0, mload(add(sig, 96)))  // Last 1 byte
        }

        return (v, r, s);
    }

    // Function to verify the signature using the message string
    function verifyMessage(
        string memory message,
        bytes memory signature,
        address expectedSigner
    ) public pure returns (bool) {
        // Hash the message string using keccak256
        bytes32 messageHash = keccak256(abi.encodePacked(message));

        // Split the signature into v, r, and s
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

        // Recreate the Ethereum Signed Message Hash
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, messageHash));

        // Recover the signer address from the prefixed message hash and signature
        address signer = ecrecover(prefixedHashMessage, v, r, s);

        // Check if the recovered address matches the expected signer address
        return signer == expectedSigner;
    }
}

contract MrrrrrchKL2024 is ERC721, Ownable, SignatureVerifier {
    // T-shirt structure
    struct Tshirt {
        uint256 id;
        address owner;
        uint256 stickerPoints;
        uint256 score;
        uint256 health;
        uint256[] stickers;
        string tribeName;
    }

    // Server address set by the contract owner
    address public serverAddress;

    // T-shirt ID counter
    uint256 private tshirtCounter = 1;

    // Mappings
    mapping(address => string) public leaderToTribeName;
    mapping(uint256 => Tshirt) public tshirts;

    // Mapping from player address to T-shirt ID
    mapping(address => uint256) public playerToTshirtId;

    // Event for T-shirt updates (for data indexing)
    event TshirtUpdated(
        uint256 id,
        address owner,
        string tribeName,
        uint256 stickerPoints,
        uint256 score,
        uint256 health,
        uint256[] stickers
    );

    // Events for tribe leader management
    event TribeLeaderRegistered(address leaderAddress, string tribeName);
    event TribeLeaderRemoved(address leaderAddress, string tribeName);

    constructor() ERC721("MrrrrrchKL2024Test", "MRCHKLT1") Ownable(msg.sender) {}

    // Set server address
    function setServerAddress(address server) external onlyOwner {
        serverAddress = server;
    }

    // Register tribe leader (only owner)
    function registerTribeLeader(address leaderAddress, string memory tribeName) external onlyOwner {
        require(bytes(leaderToTribeName[leaderAddress]).length == 0, "Leader already registered");
        leaderToTribeName[leaderAddress] = tribeName;

        emit TribeLeaderRegistered(leaderAddress, tribeName);
    }

    // Remove tribe leader (only owner)
    function removeTribeLeader(address leaderAddress) external onlyOwner {
        require(bytes(leaderToTribeName[leaderAddress]).length != 0, "Leader not registered");
        string memory tribeName = leaderToTribeName[leaderAddress];

        delete leaderToTribeName[leaderAddress];

        emit TribeLeaderRemoved(leaderAddress, tribeName);
    }

    // Mint new T-shirt (only tribe leader)
    function mintTshirt(address player) external {
        string memory tribeName = leaderToTribeName[msg.sender];
        require(bytes(tribeName).length != 0, "Not a tribe leader");

        require(playerToTshirtId[player] == 0, "Player already has a T-shirt");

        Tshirt memory newTshirt = Tshirt({
            id: tshirtCounter,
            owner: player,
            stickerPoints: 1,
            score: 1,
            health: 3,
            stickers: new uint256[](21),
            tribeName: tribeName
        });

        tshirts[tshirtCounter] = newTshirt;
        playerToTshirtId[player] = tshirtCounter;

        _safeMint(player, tshirtCounter);

        // Emit T-shirt update event
        emitTshirtChangeEvent(tshirtCounter);

        tshirtCounter++;
    }

    // Exchange sticker point for a sticker
    function exchangeSticker(uint256 tshirtId, uint256 stickerNumber) external {
        require(ownerOf(tshirtId) == msg.sender, "Not the owner of the T-shirt");
        require(stickerNumber >= 1 && stickerNumber <= 50, "Invalid sticker number");
        Tshirt storage tshirt = tshirts[tshirtId];
        require(tshirt.stickerPoints >= 1, "Not enough sticker points");

        tshirt.stickerPoints -= 1;
        tshirt.stickers.push(stickerNumber);

        // Emit T-shirt update event
        emitTshirtChangeEvent(tshirtId);
    }

    // Fight between two T-shirts
    function fight(
        uint256 tshirtId1,
        bytes memory signature1,
        uint256 tshirtId2,
        bytes memory signature2,
        uint8 winner,
        bytes memory serverSignature
    ) external {
        // Verify ownership
        require(ownerOf(tshirtId1) != ownerOf(tshirtId2), "Same owner for both T-shirts");

        // Messages to be signed
        string memory message1 = uint2str(tshirtId1);
        string memory message2 = uint2str(tshirtId2);
        string memory serverMessage = winner == 0 ? "0" : "1";

        // Verify signatures
        require(
            verifyMessage(message1, signature1, ownerOf(tshirtId1)),
            "Invalid signature from player 1"
        );
        require(
            verifyMessage(message2, signature2, ownerOf(tshirtId2)),
            "Invalid signature from player 2"
        );
        require(
            verifyMessage(serverMessage, serverSignature, serverAddress),
            "Invalid server signature"
        );
        require(winner == 0 || winner == 1, "Winner must be 0 or 1");

        Tshirt storage tshirt1 = tshirts[tshirtId1];
        Tshirt storage tshirt2 = tshirts[tshirtId2];

        if (winner == 0) {
            // Player 1 wins
            tshirt1.score += 1;
            tshirt1.stickerPoints += 1;
            if (tshirt2.health > 0) {
                tshirt2.health -= 1;
            }

            // Emit T-shirt update events
            emitTshirtChangeEvent(tshirtId1);
            emitTshirtChangeEvent(tshirtId2);
        } else {
            // Player 2 wins
            tshirt2.score += 1;
            tshirt2.stickerPoints += 1;
            if (tshirt1.health > 0) {
                tshirt1.health -= 1;
            }

            // Emit T-shirt update events
            emitTshirtChangeEvent(tshirtId1);
            emitTshirtChangeEvent(tshirtId2);
        }
    }

    // Heal T-shirt (only tribe leader)
    function healTshirt(uint256 tshirtId) external {
        string memory tribeName = leaderToTribeName[msg.sender];
        require(bytes(tribeName).length != 0, "Not a tribe leader");

        Tshirt storage tshirt = tshirts[tshirtId];
        require(
            keccak256(bytes(tshirt.tribeName)) == keccak256(bytes(tribeName)),
            "T-shirt not in your tribe"
        );

        tshirt.health += 1;

        // Emit T-shirt update event
        emitTshirtChangeEvent(tshirtId);
    }

    // Helper function to emit T-shirt update events
    function emitTshirtChangeEvent(uint256 tshirtId) internal {
        Tshirt storage tshirt = tshirts[tshirtId];
        emit TshirtUpdated(
            tshirt.id,
            tshirt.owner,
            tshirt.tribeName,
            tshirt.stickerPoints,
            tshirt.score,
            tshirt.health,
            tshirt.stickers
        );
    }

    // Helper function to convert uint to string
    function uint2str(uint256 value) internal pure returns (string memory str) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 len;
        while (temp != 0) {
            len++;
            temp /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        temp = value;
        while (temp != 0) {
            bstr[--k] = bytes1(uint8(48 + temp % 10));
            temp /= 10;
        }
        str = string(bstr);
    }

    // *** Transfers Disabled ***

    // Override transfer functions to disable transfers
    function approve(address to, uint256 tokenId) public override {
        revert("Transfers are disabled for this NFT");
    }

    function setApprovalForAll(address operator, bool approved) public override {
        revert("Transfers are disabled for this NFT");
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("Transfers are disabled for this NFT");
    }
    
}
