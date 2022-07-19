//SPDX-License-Identifier: Unlicense

import "./Authorization.sol";

contract Protected {
    Authorization internal s_authorization;

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }
}