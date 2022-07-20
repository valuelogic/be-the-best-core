//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./libraries/Roles.sol";

contract Authorization is AccessControl {
    constructor() {
        _grantRole(Roles.ADMIN, msg.sender);

        _setRoleAdmin(Roles.PLAYER_MANAGER, Roles.ADMIN);
        _setRoleAdmin(Roles.REQUEST_MANAGER, Roles.ADMIN);

        _setRoleAdmin(Roles.ADMIN, Roles.PLAYER_MANAGER);
        _setRoleAdmin(Roles.PLAYER, Roles.PLAYER_MANAGER);
    }
}