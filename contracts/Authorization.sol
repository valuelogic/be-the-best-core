//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./libraries/Roles.sol";

error Authorization__MissingRole(bytes32 role, address account);
error Authorization__MissingOneOfRoles(bytes32[] roles, address account);

contract Authorization is AccessControl {
    constructor() {
        _grantRole(Roles.ADMIN, msg.sender);
        _setRoleAdmin(Roles.ADMIN, Roles.ADMIN);
        _setRoleAdmin(Roles.PLAYER, Roles.ADMIN);
    }

    function ensureHasRole(bytes32 role, address account) external view {
        if(!hasRole(role, account)) {
            revert Authorization__MissingRole(role, account);
        }
    }
}