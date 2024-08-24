// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "./IRankFunction.sol";
import "./Common.sol";

struct Config {
    uint256 maxVotes;
    uint256 pointsDecayPercent;
    IRankFunction rankFunction;
    Rank lowestRankToVote;
    Rank lowestRankToInvite;
}

struct Global {
    uint256 totalPoints;
    uint256 totalVotes;
}

struct UserDetails {
    int256 points;
    uint256 voteCount;
    Rank rank;
    uint256 lastUpdated;
    address invitee;
}

struct Feed {
    address owner;
    uint256 createdAt;
    uint256 upvotes;
    uint256 downvotes;
    string content;
}

interface ISpace {
    function updateRankFunction(IRankFunction _rankFunction) external;
    function highestUpvoterRank(address _user) external view returns (Rank);
    function getFeed(uint256 feedId) external view returns (Feed memory);
    function getFeedCount() external view returns (uint256);
    function getUser(address user) external view returns (UserDetails memory);
    function getUserPoints(address user) external view returns (int256 points);
    function getUserMultiplier(address user) external view returns (uint256);
    function getConfig() external view returns (Config memory);
    function didUserVote(address user, uint256 feedId) external view returns (bool);
    function name() external view returns (string memory);
    function inviteUser(address _user) external;
    function register() external;
    function addFeed(string memory _content) external;
    function upvote(uint256 feedId) external;
    function downvote(uint256 feedId) external;
}