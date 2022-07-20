// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

library Roles {
    bytes32 constant ADMIN = keccak256('ADMIN');
    bytes32 constant PLAYER = keccak256('PLAYER');
    bytes32 constant PLAYER_MANAGER = keccak256('PLAYER_MANAGER');
    bytes32 constant REQUEST_MANAGER = keccak256('REQUEST_MANAGER');
}