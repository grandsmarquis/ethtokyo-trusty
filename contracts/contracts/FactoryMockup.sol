// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./SpaceMockup.sol";

contract FactoryMockup {

    event SpaceCreated(uint256 id, address indexed space);

    mapping(uint256 => address) public spaces;

    uint256 public spaceCount;

    function createSpace(string memory _name) public {
        // can probably change this to a proxy if time allows
        SpaceMockup space = new SpaceMockup(msg.sender, _name);
        spaces[spaceCount] = address(space);
        emit SpaceCreated(spaceCount, address(space));
        spaceCount++;
    }

}