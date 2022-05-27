//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

library SharedModel {
    struct User {
        address walletAddress;
        string nick;
        uint32 points;
        bool isAdmin;
    }
}
