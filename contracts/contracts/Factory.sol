// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Space.sol";

contract Factory {

    event SpaceCreated(uint256 id, address indexed space);

    mapping(uint256 => address) public spaces;

    uint256 public spaceCount;

    function createSpace(address _owner, address[] calldata masters, address rankFunction, string calldata _name, string calldata _symbol) external {
        // can probably change this to a proxy if time allows
        Space space = new Space(_owner, masters, rankFunction, _name, _symbol);
        spaces[spaceCount] = address(space);
        emit SpaceCreated(spaceCount, address(space));
        spaceCount++;
    }
}