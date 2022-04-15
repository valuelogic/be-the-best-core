pragma solidity ^0.8.0;

library SharedModel {
    struct User {
        bool isAdmin;
        address wallet;
        uint points;
        string nick;
    }
}
