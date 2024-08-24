//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IPublicResolver {
    function setAddr(bytes32 node, uint256 coinType, bytes calldata a) external;
}
