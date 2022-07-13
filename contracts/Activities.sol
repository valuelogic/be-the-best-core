//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Activity.sol";
import "./Authorization.sol";

contract Activities {
    event ActivityCreated(address activity);

    Authorization s_authorization;
    address[] s_activities;

    constructor(Authorization _authorizationAddress) {
        s_authorization = _authorizationAddress;
    }

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    function createActivity(string memory _name, uint8 _reward, bool _active) external onlyRole(s_authorization.ADMIN())
    {
        address activityAddress = address(new Activity(_name, _reward, _active, s_authorization));
        s_activities.push(activityAddress);
        emit ActivityCreated(activityAddress);
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }
}
