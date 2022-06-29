//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Users.sol";
import "./Activity.sol";

contract Activities {
    Users s_users;
    address[] s_activities;

    event ActivityCreated(address activity);

    modifier onlyAdmin() {
        s_users.ensureIsAdmin(msg.sender);
        _;
    }

    constructor(address _usersAddress) {
        s_users = Users(_usersAddress);
    }

    function createActivity(string memory _name, uint8 _reward, bool _active)
        external
        onlyAdmin
    {
        address activityAddress = address(
            new Activity(_name, _reward, _active, address(s_users))
        );
        s_activities.push(activityAddress);
        emit ActivityCreated(activityAddress);
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }
}
