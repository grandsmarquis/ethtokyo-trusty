//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IPublicResolver {
    function setAddr(bytes32 node, uint256 coinType, bytes calldata a) external;
    function setText(bytes32 node, string calldata key, string calldata value) external;
}
