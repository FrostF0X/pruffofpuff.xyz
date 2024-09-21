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

    constructor() ERC721("PruffOfPuffTest", "POFT1") {
        // Grant the deployer the default admin role, which allows them to manage all roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Grant the deployer both the admin and pruffer roles
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(PRUFFER_ROLE, msg.sender);

    }

    // Modifier to restrict access to only admins
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    // Modifier to restrict access to only pruffers or admins
    modifier onlyAuthorized() {
        require(
            hasRole(PRUFFER_ROLE, msg.sender) || hasRole(ADMIN_ROLE, msg.sender),
            "Caller is not authorized"
        );
        _;
    }

    // Check if an address is an admin
    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    // Check if an address is a pruffer
    function isPruffer(address account) public view returns (bool) {
        return hasRole(PRUFFER_ROLE, account);
    }

    // Override the supportsInterface function to handle both AccessControl and ERC721
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Function to add a new admin, can only be called by admins
    function addAdmin(address account) public onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    // Function to remove an admin, can only be called by admins
    function removeAdmin(address account) public onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }

    // Function to add a pruffer, can only be called by admins
    function addPruffer(address account) public onlyAdmin {
        grantRole(PRUFFER_ROLE, account);
    }

    // Function to remove a pruffer, can only be called by admins
    function removePruffer(address account) public onlyAdmin {
        revokeRole(PRUFFER_ROLE, account);
    }

    // Function to mint a new token to a specific address, transfers 0.01 ether to the destination address
    function mint(address destination, string memory tokenURI) public payable onlyAuthorized {
        require(msg.value == 0.01 ether, "Must send 0.01 ether to mint");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(destination, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Transfer 0.01 ether to the destination address
        (bool success, ) = destination.call{value: msg.value}("");
        require(success, "Ether transfer failed");

        emit TokenMinted(destination, newTokenId, tokenURI);
        emit EtherTransferred(destination, msg.value);
    }
}
