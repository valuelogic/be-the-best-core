//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Activity.sol";
import "./Authorization.sol";
import "./libraries/Roles.sol";
import "./Protected.sol";

contract Activities is Protected {
    event ActivityCreated(address activity);

    address[] private s_activities;

    constructor(Authorization _authorizationAddress) Protected(_authorizationAddress) {
    }

    function createActivity(string memory _name, uint8 _reward, bool _active) external onlyRole(Roles.ADMIN)
    {
        address activityAddress = address(new Activity(_name, _reward, _active, s_authorization));
        s_activities.push(activityAddress);
        emit ActivityCreated(activityAddress);
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }
}
