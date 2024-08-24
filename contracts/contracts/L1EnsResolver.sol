// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract L1EnsResolver {
    address constant L1_SLOAD_ADDRESS = 0x0000000000000000000000000000000000000101;

    uint256 constant NODE_ID_SLOT = 1;
    uint256 constant NAMES_SLOT = 6;

    address public immutable ensUser;
    address public immutable nameWrapper;

    constructor(address _ensUser, address _nameWrapper) {
        ensUser = _ensUser;
        nameWrapper = _nameWrapper;
    }

    function getAddressUsername(address user) external view returns (string memory username) {
        bytes32 nodeId = getNodeId(user);

        bytes32 slot = keccak256(abi.encodePacked(nodeId, NAMES_SLOT));

        bytes memory ret = _retrieveSlotFromL1(nameWrapper, uint256(slot));
        return _bytes32ToString(abi.decode(ret, (bytes32)));
    }

    function getNodeId(address user) public view returns (bytes32 nodeId) {
        bytes32 slot = keccak256(abi.encodePacked(uint256(uint160(user)), NODE_ID_SLOT));
        
        bytes memory ret = _retrieveSlotFromL1(ensUser, uint256(slot));
        (nodeId) = abi.decode(ret, (bytes32));
    }

    function _retrieveSlotFromL1(address l1StorageAddress, uint256 slot) private view returns (bytes memory) {
        (bool success, bytes memory returnValue) = L1_SLOAD_ADDRESS.staticcall(abi.encodePacked(l1StorageAddress, slot));
        if(!success)
        {
            revert("L1SLOAD failed");
        }
        return returnValue;
    }

    function _bytes32ToString(bytes32 _bytes32) private pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            if(_bytes32[i] == 0x00)
                break;
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
