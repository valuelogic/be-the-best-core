//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";

error Authorization__MissingRole(bytes32 role, address account);
error Authorization__MissingOneOfRoles(bytes32[] roles, address account);

contract Authorization is AccessControl {
    bytes32 public constant ADMIN = keccak256('ADMIN');
    bytes32 public constant USER_MANAGER = keccak256('USER_MANAGER');
    bytes32 public constant REVIEWER = keccak256('REVIEWER');
    bytes32 public constant PLAYER = keccak256('PLAYER');

    constructor() {
        _grantRole(ADMIN, msg.sender);
        _grantRole(USER_MANAGER, msg.sender);
        _setRoleAdmin(USER_MANAGER, USER_MANAGER);
        _setRoleAdmin(REVIEWER, USER_MANAGER);
        _setRoleAdmin(PLAYER, USER_MANAGER);
        _setRoleAdmin(ADMIN, USER_MANAGER);
    }

    function ensureHasRole(bytes32 role, address account) external view {
        if(!hasRole(role, account)) {
            revert Authorization__MissingRole(role, account);
        }
    }
}