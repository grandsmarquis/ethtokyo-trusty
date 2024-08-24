// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISpace.sol";
import "./IRankFunction.sol";
import "./Common.sol";


contract Space is ISpace, ERC721Enumerable, Ownable {

    uint256 public feedCounter;

    Config private _config;

    mapping(address userAddress => UserDetails user) public users;

    Feed[] private _feeds;

    mapping(address user => mapping(uint256 feedId => bool didVote)) public didUserVote;

    mapping(address user => Rank highestUpvoterRank) private _highestUpvoterRank;
    
    mapping(uint256 => uint256) public feedPoints;
    mapping(uint256 => uint256) public feedCreatedAt;
    mapping(uint256 => string) public feedContent;

    constructor(address _owner, string memory _name, string memory _symbol) ERC721(_name, _symbol)
        Ownable(_owner) {  
    }

    function getConfig() external view returns (Config memory) {
        return _config;
    }

    function getFeed(uint256 _feedId) external view returns (Feed memory) {
        return _feeds[_feedId];
    }

    function getUser(address user) external view returns (UserDetails memory) {
        return _getUpdatedUser(user);
    }

    function highestUpvoterRank(address _user) external view returns (Rank) {
        return _highestUpvoterRank[_user];
    }

    function inviteUser(address _user) external verifyRankToInvite {
        // TODO: check number of invites left?

        if (users[_user].rank == Rank.NON_MEMBER) {
            users[_user] = UserDetails(0, 0, Rank.INVITED, block.timestamp, msg.sender);
        }
    }

    function register() external verifyInvited {
        users[msg.sender].rank = Rank.UNRANKED;
    }

    function addFeed(string memory _content) external verifyRankToPostFeed {
        uint256 feedId = _feeds.length;
        _feeds.push(Feed(msg.sender, block.timestamp, 0, 0, _content));
        _safeMint(msg.sender, feedId);
    }

    function downvote(uint256 _feedId) external verifyRankToVote {
        if (didUserVote[msg.sender][_feedId]) {
            revert("UserDetails already voted for this feed");
        }

        _feeds[_feedId].downvotes += 1;

        didUserVote[msg.sender][_feedId] = true;
    }

    function upvote(uint256 _feedId) external verifyRankToVote {
        if (didUserVote[msg.sender][_feedId]) {
            revert("UserDetails already voted for this feed");
        }

        Feed storage feed = _feeds[_feedId];

        feed.upvotes += 1;

        // update the highest upvoter rank for the feed owner
        if (users[msg.sender].rank > _highestUpvoterRank[feed.owner]) {
            _highestUpvoterRank[feed.owner] = users[msg.sender].rank;
        }

        didUserVote[msg.sender][_feedId] = true;
    }

     function _baseURI() internal pure override returns (string memory) {
        return "https://apitogetimageofnft?id=";
    }

    function updateUserPoints(address _user) public {
        // update the decaying of the users points using userPointsLastUpdated and the percent per zeek?
    }

    function getFeedCount() public view returns (uint256) {
        return _feeds.length;
    }

    function _getUpdatedUser(address user) internal view returns (UserDetails memory userDetails) {
        userDetails = users[user];

        userDetails.rank = _calculateRank(user);
        userDetails.lastUpdated = block.timestamp;
    }

    function _calculateRank(address user) internal view returns (Rank) {
        return _config.rankFunction.calculateRank(user);
    }

    function _isValidRank(Rank userRank, Rank requiredRank) internal pure returns (bool) {
        return uint256(userRank) >= uint256(requiredRank);
    }

    function _verifyRank(Rank userRank, Rank requiredRank) internal pure {
        if (!_isValidRank(userRank, requiredRank)) {
            revert InvalidRank(userRank, requiredRank);
        }
    }

    modifier verifyRankToVote() {
        _verifyRank(users[msg.sender].rank, _config.lowestRankToVote);
        _;
    }

    modifier verifyRankToPostFeed() {
        _verifyRank(users[msg.sender].rank, Rank.UNRANKED);
        _;
    }

    modifier verifyRankToInvite() {
        _verifyRank(users[msg.sender].rank, _config.lowestRankToInvite);
        _;
    }

    modifier verifyInvited() {
        _verifyRank(users[msg.sender].rank, Rank.INVITED);
        _;
    }

    error InvalidRank(Rank userRank, Rank requiredRank);
}