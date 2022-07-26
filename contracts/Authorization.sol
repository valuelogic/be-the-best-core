//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./libraries/Roles.sol";

contract Authorization is AccessControl {
    constructor() {
        _grantRole(Roles.ADMIN, msg.sender);
        _setRoleAdmin(Roles.ADMIN, Roles.ADMIN);
        _setRoleAdmin(Roles.PLAYER, Roles.ADMIN);
    }
}