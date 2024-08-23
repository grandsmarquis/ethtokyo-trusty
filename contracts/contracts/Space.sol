// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// having the space as NFT collection of feed items seems cool and can help with UI to enumerate one user items
// the NFT should not be transferrable then!
// space is ownable maybe to add initial invites then  remove ownership later
contract Space is ERC721, ERC721Enumerable, Ownable {

    public string name;

    uint256 public feedCounter;

    mapping(address => bool) public userPoints;
    mapping(address => uint256) public userPointsLastUpdated;
    
    mapping(uint256 => uint256) public feedPoints;
    mapping(uint256 => uint256) public feedCreatedAt;

    constructor(address _owner, string memory _name) ERC721(_name, _name)
        Ownable(_owner) {  
        name = _name;
    }

    function inviteUser(address _user) public {
        // TODO: check if user is owner or have right to invite?
    }

    function addFeed(string memory _content) public {
        // TODO: check if user is owner or have right to mint?
        feedCreatedAt[feedCounter] = block.timestamp;
        _safeMint(msg.sender, feedCounter++);
    }

    function challengeFeed(uint256 _feedId) public {
        // TODO: do the challenge here if possible
    }

    function upvote(uint256 _feedId) public {
        // TODO: check if user has right to upvote and have enough points?
        updateUserPoints(msg.sender);        
        userPoints[msg.sender] -= 1;
        updateUserPoints(OwnerOf(_feedId));
        userPoints[OwnerOf(_feedId)] += 1;
    }

     function _baseURI() internal pure override returns (string memory) {
        return "https://apitogetimageofnft?id=";
    }

    function updateUserPoints(address _user) public {
        // update the decaying of the users points using userPointsLastUpdated and the percent per zeek?
    }

    // A fnction for the UI to get all infos about one feed
    function getFeed(uint256 _feedId) public view returns (string memory, address _owner)) {
        // TODO: check if user is owner or have right to get the feed?
    }

// The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}