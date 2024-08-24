// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/**
 * @title L1EnsResolver
 * @notice This contract is used to resolve the ENS subdomain (username) of an address on L1
 */
contract L1EnsResolver {
    address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;

    uint256 constant NODE_ID_SLOT = 0;
    uint256 constant NAMES_SLOT = 6;

    /// @notice The address of the TrustyEnsUser contract on L1
    address public immutable trustyEnsUser;
    /// @notice The address of the ENS NameWrapper contract on L1
    address public immutable nameWrapper;

    constructor(address _trustyEnsUser, address _nameWrapper) {
        trustyEnsUser = _trustyEnsUser;
        nameWrapper = _nameWrapper;
    }

    /**
     * @notice Get the username of an address
     * @param user The address to get the username of
     * @return username The username of the address
     */
    function getAddressUsername(address user) external view returns (string memory username) {
        bytes32 nodeId = getNodeId(user);

        bytes32 slot = keccak256(abi.encodePacked(nodeId, NAMES_SLOT));

        bytes memory ret = _retrieveSlotFromL1(nameWrapper, uint256(slot));
        return _bytes32ToString(abi.decode(ret, (bytes32)));
    }

    /**
     * @notice Get the subdomain node ID of an address
     * @param user The address to get the node ID of
     * @return nodeId The node ID of the address
     */
    function getNodeId(address user) public view returns (bytes32 nodeId) {
        bytes32 slot = keccak256(abi.encodePacked(uint256(uint160(user)), NODE_ID_SLOT));

        bytes memory ret = _retrieveSlotFromL1(trustyEnsUser, uint256(slot));
        (nodeId) = abi.decode(ret, (bytes32));
    }

    function _retrieveSlotFromL1(address l1StorageAddress, uint256 slot) private view returns (bytes memory) {
        (bool success, bytes memory returnValue) = L1_SLOAD_ADDRESS.staticcall(abi.encodePacked(l1StorageAddress, slot));
        if (!success) {
            revert("L1SLOAD failed");
        }
        return returnValue;
    }

    function _bytes32ToString(bytes32 _bytes32) private pure returns (string memory) {
        return string(abi.encodePacked(_bytes32));
    }
}
