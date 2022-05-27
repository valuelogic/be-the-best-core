//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

library SharedModel {
    struct User {
        address walletAddress;
        string nick;
        int16 points;
        bool isAdmin;
    }
}
