// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./IRankFunction.sol";
import "./ISpace.sol";
import "./Common.sol";

contract BasicRankFunction is IRankFunction {
    function calculateRank(address user) external view returns (Rank rank) {
        UserDetails memory userDetails = ISpace(msg.sender).getUser(user);

        if (userDetails.rank == Rank.NON_MEMBER) {
            return Rank.NON_MEMBER;
        }

        if (userDetails.rank == Rank.INVITED) {
            return Rank.INVITED;
        }

        if (userDetails.points < 2) {
            return Rank.NOVICE;
        }

        if (userDetails.points < 5) {
            return Rank.INTERMEDIATE;
        }

        if (userDetails.points < 10) {
            return Rank.ADVANCED;
        }

        if (userDetails.points < 20) {
            return Rank.EXPERT;
        }

        return Rank.MASTER;
    }
}