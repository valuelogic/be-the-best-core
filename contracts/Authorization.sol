//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";

error Authorization__MissingRole(bytes32 role, address account);
error Authorization__MissingOneOfRoles(bytes32[] roles, address account);

contract Authorization is AccessControl {
    bytes32 public constant ADMIN = keccak256('ADMIN');
    bytes32 public constant PLAYER = keccak256('PLAYER');

    constructor() {
        _grantRole(ADMIN, msg.sender);
        _setRoleAdmin(ADMIN, ADMIN);
        _setRoleAdmin(PLAYER, ADMIN);
    }

    function ensureHasRole(bytes32 role, address account) external view {
        if(!hasRole(role, account)) {
            revert Authorization__MissingRole(role, account);
        }
    }
}