// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./external/INameWrapper.sol";
import "./external/IPublicResolver.sol";

/**
 * @title TrustyEnsUsers contract
 * @dev Contract for registering Trusty users using ENS subdomains
 * @dev Each user can register only once
 */
contract TrustyEnsUsers is ERC1155Holder {
    /// @notice ENS NameWrapper contract
    INameWrapper public immutable nameWrapper;
    /// @notice ENS PublicResolver contract
    IPublicResolver public immutable resolver;
    /// @notice Root ENS node
    bytes32 public immutable rootNode;

    /// @notice User subnodes mapping
    mapping(address user => bytes32 subNodeId) public subNodes;

    constructor(INameWrapper _nameWrapper, IPublicResolver _resolver, bytes32 _rootNode) {
        nameWrapper = _nameWrapper;
        resolver = _resolver;
        rootNode = _rootNode;
    }

    /**
     * @notice Register user with ENS subdomain
     * @param username User's username
     */
    function registerUser(string calldata username) external {
        require(subNodes[msg.sender] == 0, "User already registered");
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(username).length <= 32, "Username cannot be more than 32 characters");

        bytes32 subNodeId = nameWrapper.setSubnodeRecord(rootNode, username, address(this), address(resolver), 0, 0, 0);
        resolver.setAddr(subNodeId, 60, abi.encodePacked(msg.sender));

        subNodes[msg.sender] = subNodeId;
    }

    function setAvatar(string calldata path) external {
        require(subNodes[msg.sender] != 0, "User not registered");

        resolver.setText(subNodes[msg.sender], "avatar", path);
    }
}
