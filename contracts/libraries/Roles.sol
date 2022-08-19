// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

library Roles {
    bytes32 constant public ADMIN = keccak256("ADMIN");
    bytes32 constant public PLAYER = keccak256("PLAYER");
    bytes32 constant public PLAYER_MANAGER = keccak256("PLAYER_MANAGER");
    bytes32 constant public REQUEST_MANAGER = keccak256("REQUEST_MANAGER");
}