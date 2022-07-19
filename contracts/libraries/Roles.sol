
// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

library Roles {
    bytes32 constant ADMIN = keccak256('ADMIN');
    bytes32 constant PLAYER = keccak256('PLAYER');
}