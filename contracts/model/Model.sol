//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library SharedModel {
    struct User {
        address wallet;
        string nick;
        uint points;
        bool isAdmin;
    }
}
