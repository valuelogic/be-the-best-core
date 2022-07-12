//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

library SharedModel {
    struct Player {
        address walletAddress;
        string nick;
        uint32 points;
    }

    struct Request {
        address player;
        address activity;
        uint32 points;
        RequestStatus status;
    }

    enum RequestStatus {
        pending,
        approved,
        rejected
    }
}
