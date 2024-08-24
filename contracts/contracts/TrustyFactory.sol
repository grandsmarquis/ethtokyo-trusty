// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "./TrustySpace.sol";

/**
 * @title TrustyFactory
 * @dev Factory contract to create spaces
 */
contract TrustyFactory {
    event SpaceCreated(uint256 id, address indexed space);

    mapping(uint256 => address) public spaces;
    uint256 public spaceCount;

    function createSpace(address _owner, address[] calldata masters, address rankFunction, string calldata _name)
        external
        returns (address)
    {
        // can probably change this to a proxy if time allows
        TrustySpace space = new TrustySpace(_owner, masters, rankFunction, _name);
        spaces[spaceCount] = address(space);
        emit SpaceCreated(spaceCount, address(space));
        spaceCount++;

        return address(space);
    }
}
