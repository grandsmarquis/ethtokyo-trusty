// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./IRankFunction.sol";
import "./ITrustySpace.sol";
import "./Common.sol";

/**
 * @title BasicRankFunction
 * @dev Basic rank function contract to showcase the usage of rank functions
 */
contract BasicRankFunction is IRankFunction {
    function calculateRank(address user) external view returns (Rank rank) {
        int256 points = ITrustySpace(msg.sender).getUserPoints(user);

        if (points < 1) {
            return Rank.UNRANKED;
        }

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
