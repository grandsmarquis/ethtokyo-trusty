// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "./Common.sol";

interface IRankFunction {
    function calculateRank(address user) external view returns (Rank rank);
}
