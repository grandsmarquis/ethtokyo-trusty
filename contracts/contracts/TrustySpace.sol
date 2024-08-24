// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ITrustySpace.sol";
import "./IRankFunction.sol";
import "./Common.sol";

/**
 * @title TrustySpace
 * @notice TrustySpace helps curating trusted community
 */
contract TrustySpace is ITrustySpace, Ownable {
    /// @notice Space name
    string public name;

    /// @notice Space configuration
    Config private _config;

    /// @notice User details
    mapping(address userAddress => UserDetails user) private _users;

    /// @notice User feeds
    Feed[] private _feeds;

    /// @notice Did user vote on feed
    mapping(address user => mapping(uint256 feedId => bool didVote)) public didUserVote;

    /// @notice Highest upvoter rank for each user
    mapping(address user => Rank highestUpvoterRank) private _highestUpvoterRank;

    /// @notice Vote multiplier for each rank
    mapping(Rank rank => uint256 voteMultiplier) public rankVoteMultiplier;

    constructor(address _owner, address[] memory masters, address rankFunction, string memory _name) Ownable(_owner) {
        require(masters.length > 0, "At least one master required");

        name = _name;

        // set initial master users
        for (uint256 i; i < masters.length; i++) {
            _users[masters[i]] = UserDetails(20, 0, Rank.MASTER, block.timestamp, address(0));
            _highestUpvoterRank[masters[i]] = Rank.MASTER;
        }

        _config.rankFunction = IRankFunction(rankFunction);

        rankVoteMultiplier[Rank.NOVICE] = 1;
        rankVoteMultiplier[Rank.INTERMEDIATE] = 2;
        rankVoteMultiplier[Rank.ADVANCED] = 3;
        rankVoteMultiplier[Rank.EXPERT] = 4;
        rankVoteMultiplier[Rank.MASTER] = 5;
    }

    // View functions

    /**
     * @notice Get space configuration
     * @return Space configuration
     */
    function getConfig() external view returns (Config memory) {
        return _config;
    }

    /**
     * @notice Get user details
     * @param user The address of the user
     * @return The user details
     */
    function getUser(address user) external view returns (UserDetails memory) {
        return _getUpdatedUser(user);
    }

    /**
     * @notice Get user points
     * @dev The sum of upvotes and downvotes on each user feed
     * @param user The address of the user
     * @return int256 The user points
     */
    function getUserPoints(address user) external view returns (int256) {
        return _users[user].points;
    }

    /**
     * @notice Get user vote multiplier
     * @param user The address of the user
     * @return The user vote multiplier
     */
    function getUserMultiplier(address user) external view returns (uint256) {
        UserDetails memory userDetails = _getUpdatedUser(user);
        return rankVoteMultiplier[userDetails.rank];
    }

    /**
     * @notice Highest rank who upvoted the user
     * @param _user The address of the upvoted user
     * @return The highest rank who upvoted the user
     */
    function highestUpvoterRank(address _user) external view returns (Rank) {
        return _highestUpvoterRank[_user];
    }

    /**
     * @notice Get feed
     * @param _feedId The feed ID
     * @return The feed
     */
    function getFeed(uint256 _feedId) external view returns (Feed memory) {
        return _feeds[_feedId];
    }

    /**
     * @notice Get feed count
     * @return Total number of feeds
     */
    function getFeedCount() public view returns (uint256) {
        return _feeds.length;
    }

    // Write functions

    /**
     * @notice Update rank function
     * @param _rankFunction The new rank function
     */
    function updateRankFunction(IRankFunction _rankFunction) external onlyOwner {
        _config.rankFunction = _rankFunction;
    }

    /**
     * @notice Invite user to the space
     * @param _user The address of the user to invite
     */
    function inviteUser(address _user) external updateUser verifyRankToInvite {
        if (_users[_user].rank == Rank.NON_MEMBER) {
            _users[_user] = UserDetails(0, 0, Rank.INVITED, block.timestamp, msg.sender);
        }
    }

    /**
     * @notice Register user to the space
     * @dev User must be invited to register
     */
    function register() external verifyInvited {
        _users[msg.sender].rank = Rank.UNRANKED;
    }

    /**
     * @notice Add feed
     * @param _content The feed content
     */
    function addFeed(string memory _content) external updateUser verifyRankToPostFeed {
        _feeds.push(Feed(msg.sender, block.timestamp, 0, 0, _content));
    }

    /**
     * @notice Upvote the feed
     * @param _feedId The feed ID
     */
    function upvote(uint256 _feedId) external updateUser verifyRankToVote verifyCanVoteOnFeed(_feedId) {
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

    /**
     * @notice Downvote the feed
     * @param _feedId The feed ID
     */
    function downvote(uint256 _feedId) external updateUser verifyRankToVote verifyCanVoteOnFeed(_feedId) {
        uint256 voteMultiplier = rankVoteMultiplier[_users[msg.sender].rank];
        Feed storage feed = _feeds[_feedId];

        feed.downvotes += voteMultiplier;

        _users[feed.owner].points -= int256(voteMultiplier);

        didUserVote[msg.sender][_feedId] = true;
    }

    // Internal functions

    /**
     * @notice Get updated user details
     * @dev Update user details based on the rank function
     * User can only be as high rank as his highest upvoter rank
     * @param user The address of the user
     * @return userDetails The updated user details
     */
    function _getUpdatedUser(address user) internal view returns (UserDetails memory userDetails) {
        userDetails = _users[user];

        Rank updatedRank = _calculateRank(user);

        if (uint256(userDetails.rank) > uint256(Rank.INVITED)) {
            // user cannot be higher rank than his highest upvoter rank
            if (uint256(updatedRank) > uint256(_highestUpvoterRank[user])) {
                updatedRank = _highestUpvoterRank[user];
            }

            userDetails.rank = updatedRank;
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

    // Modifiers

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
