//SPDX-License-Identifier: Unlicense

import "./Authorization.sol";

error Protected__MissingRole(bytes32 role, address account);

contract Protected {
    Authorization internal s_authorization;

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    modifier onlyRole(bytes32 _role) {
        if(!s_authorization.hasRole(role, account)) {
            revert Protected__MissingRole(role, account);
        }
        _;
    }
}