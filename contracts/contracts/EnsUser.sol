// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./external/INameWrapper.sol";
import "./external/IPublicResolver.sol";

contract EnsUser is ERC1155Holder {
    INameWrapper public immutable nameWrapper;
    IPublicResolver public immutable resolver;
    bytes32 public immutable parentNode;
    mapping(address => bytes32) public subNodes;

    constructor(INameWrapper _nameWrapper, IPublicResolver _resolver, bytes32 _parentNode) {
        nameWrapper = _nameWrapper;
        resolver = _resolver;
        parentNode = _parentNode;
    }

    function registerUser(string calldata username) external {
        require(subNodes[msg.sender] == 0, "User already registered");
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(username).length <= 32, "Username cannot be more than 32 characters");

        bytes32 subNodeId = nameWrapper.setSubnodeRecord(parentNode, username, address(this), address(resolver), 0, 0, 0);
        resolver.setAddr(subNodeId, 60, abi.encodePacked(msg.sender));

        subNodes[msg.sender] = subNodeId;
    }
}