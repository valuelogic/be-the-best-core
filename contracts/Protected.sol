//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Authorization.sol";

error Protected__MissingRole(bytes32 role, address account);

contract Protected {
    Authorization internal s_authorization;

    modifier onlyRole(bytes32 _role) {
        if(!s_authorization.hasRole(_role, msg.sender)) {
            revert Protected__MissingRole(_role, msg.sender);
        }
        _;
    }

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }
}