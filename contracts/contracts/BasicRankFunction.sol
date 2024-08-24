// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "./IRankFunction.sol";
import "./ISpace.sol";
import "./Common.sol";

contract BasicRankFunction is IRankFunction {
    function calculateRank(address user) external view returns (Rank rank) {
        int256 points = ISpace(msg.sender).getUserPoints(user);

        if (points < 2) {
            return Rank.NOVICE;
        }

        if (points < 5) {
            return Rank.INTERMEDIATE;
        }

        if (points < 10) {
            return Rank.ADVANCED;
        }

        if (points < 20) {
            return Rank.EXPERT;
        }

        return Rank.MASTER;
    }
}