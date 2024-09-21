// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721URIStorage} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PruffOfPuff is ERC721URIStorage, AccessControl {
    uint256 private _tokenIds;

    // Define roles using keccak256 hash
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PRUFFER_ROLE = keccak256("PRUFFER_ROLE");

    // Event for minting a new token
    event TokenMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event EtherTransferred(address indexed to, uint256 amount);

    // Keep track of all token IDs for each owner
    mapping(address => uint256[]) private _ownedTokens;

    constructor() ERC721("PruffOfPuffTest", "POFT1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PRUFFER_ROLE, msg.sender);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    function isPruffer(address account) public view returns (bool) {
        return hasRole(PRUFFER_ROLE, account);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function addAdmin(address account) public onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    function removeAdmin(address account) public onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }

    function addPruffer(address account) public onlyAdmin {
        grantRole(PRUFFER_ROLE, account);
    }

    function removePruffer(address account) public onlyAdmin {
        revokeRole(PRUFFER_ROLE, account);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        string memory _tokenURI = super.tokenURI(tokenId);
        return string(abi.encodePacked("ipfs://", _tokenURI));
    }

    function ownsNFTWithURI(string memory _tokenURI) public view returns (bool) {
        uint256[] memory senderTokens = _ownedTokens[msg.sender]; // Get all tokens owned by the sender

        for (uint256 i = 0; i < senderTokens.length; i++) {
            uint256 tokenId = senderTokens[i];
            if (keccak256(abi.encodePacked(tokenURI(tokenId))) == keccak256(abi.encodePacked(_tokenURI))) {
                return true; // The sender owns a token with the specified URI
            }
        }

        return false; // The sender does not own a token with the specified URI
    }

    function mint(address destination, string memory _tokenURI) public payable {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(destination, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        // Track token ownership
        _ownedTokens[destination].push(newTokenId);

        (bool success, ) = destination.call{value: msg.value}("");
        require(success, "Ether transfer failed");

        emit TokenMinted(destination, newTokenId, _tokenURI);
        emit EtherTransferred(destination, msg.value);
    }

    // Function to transfer the first NFT owned by msg.sender
    function transferFirstNFT(address to) public {
        require(_ownedTokens[msg.sender].length > 0, "No NFTs to transfer");

        uint256 tokenId = _ownedTokens[msg.sender][0]; // Get the first token ID owned by msg.sender
        safeTransferFrom(msg.sender, to, tokenId); // Transfer the token

        // Remove the token from the original owner's list
        _removeTokenFromList(msg.sender, tokenId);

        // Add the token to the new owner's list
        _ownedTokens[to].push(tokenId);
    }

    // Internal function to remove a token from the owner's list
    function _removeTokenFromList(address from, uint256 tokenId) internal {
        uint256[] storage ownerTokens = _ownedTokens[from];
        for (uint256 i = 0; i < ownerTokens.length; i++) {
            if (ownerTokens[i] == tokenId) {
                ownerTokens[i] = ownerTokens[ownerTokens.length - 1]; // Replace with the last token
                ownerTokens.pop(); // Remove the last element
                break;
            }
        }
    }
}
