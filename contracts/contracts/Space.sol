// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ISpace.sol";
import "./IRankFunction.sol";
import "./Common.sol";


contract Space is ISpace, Ownable {
    string public name;

    Config private _config;

    mapping(address userAddress => UserDetails user) private _users;

    Feed[] private _feeds;

    mapping(address user => mapping(uint256 feedId => bool didVote)) public didUserVote;

    mapping(address user => Rank highestUpvoterRank) private _highestUpvoterRank;

    mapping(Rank rank => uint256 voteMultiplier) public rankVoteMultiplier;

    constructor(address _owner, address[] memory masters, address rankFunction, string memory _name)
        Ownable(_owner) 
    {
        require(masters.length > 0, "At least one master required");

        name = _name;

        for (uint256 i; i < masters.length; i++) {
            _users[masters[i]] = UserDetails(0, 0, Rank.MASTER, block.timestamp, address(this));
        }

        _config.rankFunction = IRankFunction(rankFunction);

        rankVoteMultiplier[Rank.NOVICE] = 1;
        rankVoteMultiplier[Rank.INTERMEDIATE] = 2;
        rankVoteMultiplier[Rank.ADVANCED] = 3;
        rankVoteMultiplier[Rank.EXPERT] = 4;
        rankVoteMultiplier[Rank.MASTER] = 5;
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

    function getUserPoints(address user) external view returns (int256) {
        return _users[user].points;
    }

    function getUserMultiplier(address user) external view returns (uint256) {
        return rankVoteMultiplier[_calculateRank(user)];
    }

    function highestUpvoterRank(address _user) external view returns (Rank) {
        return _highestUpvoterRank[_user];
    }

    function inviteUser(address _user) external verifyRankToInvite {
        // TODO: check number of invites left?

        if (_users[_user].rank == Rank.NON_MEMBER) {
            _users[_user] = UserDetails(0, 0, Rank.INVITED, block.timestamp, msg.sender);
        }
    }

    function register() external verifyInvited {
        _users[msg.sender].rank = Rank.UNRANKED;
    }

    function addFeed(string memory _content) external verifyRankToPostFeed {
        _feeds.push(Feed(msg.sender, block.timestamp, 0, 0, _content));
    }

    function upvote(uint256 _feedId) external verifyRankToVote verifyCanVoteOnFeed(_feedId) updateUser {
        Feed storage feed = _feeds[_feedId];

        uint256 voteMultiplier = rankVoteMultiplier[_users[msg.sender].rank];

        feed.upvotes += voteMultiplier;

        // update the highest upvoter rank for the feed owner
        if (_users[msg.sender].rank > _highestUpvoterRank[feed.owner]) {
            _highestUpvoterRank[feed.owner] = _users[msg.sender].rank;
        }

        _users[feed.owner].points += int256(voteMultiplier);

        didUserVote[msg.sender][_feedId] = true;
    }

    function downvote(uint256 _feedId) external verifyRankToVote verifyCanVoteOnFeed(_feedId) updateUser {
        uint256 voteMultiplier = rankVoteMultiplier[_users[msg.sender].rank];
        Feed storage feed = _feeds[_feedId];

        feed.downvotes += voteMultiplier;

        _users[feed.owner].points -= int256(voteMultiplier);

        didUserVote[msg.sender][_feedId] = true;
    }

    function getFeedCount() public view returns (uint256) {
        return _feeds.length;
    }

    function _getUpdatedUser(address user) internal view returns (UserDetails memory userDetails) {
        userDetails = _users[user];

        Rank updatedRank = _calculateRank(user);

        if (uint256(userDetails.rank) > uint256(Rank.INVITED)) {
            updatedRank = userDetails.rank;

            // TODO: check max upvoter rank
        }

        userDetails.lastUpdated = block.timestamp;
    }

    function _updateUser(address user) internal {
        _users[user] = _getUpdatedUser(user);
    }

    function _verifyCanVoteOnFeed(address user, uint256 feedId) internal view {
        require(!didUserVote[user][feedId], "UserDetails already voted for this feed");
        require(_feeds[feedId].owner != user, "UserDetails cannot vote on own feed");
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
        _verifyRank(_users[msg.sender].rank, _config.lowestRankToVote);
        _;
    }

    modifier verifyRankToPostFeed() {
        _verifyRank(_users[msg.sender].rank, Rank.UNRANKED);
        _;
    }

    modifier verifyRankToInvite() {
        _verifyRank(_users[msg.sender].rank, _config.lowestRankToInvite);
        _;
    }

    modifier verifyInvited() {
        _verifyRank(_users[msg.sender].rank, Rank.INVITED);
        _;
    }

    modifier verifyCanVoteOnFeed(uint256 feedId) {
        _verifyCanVoteOnFeed(msg.sender, feedId);
        _;
    }

    modifier updateUser() {
        _updateUser(msg.sender);
        _;
    }

    error InvalidRank(Rank userRank, Rank requiredRank);
}