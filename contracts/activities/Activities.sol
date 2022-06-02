//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "../users/Users.sol";
import "../activity/Activity.sol";

contract Activities {
    Users s_users;
    address[] s_activities;

    event ActivityAdded(address activity);
    event ActivityDeleted(address activity);

    modifier onlyAdmin() {
        require(s_users.getUser(msg.sender).isAdmin, "You are not an admin.");
        _;
    }

    constructor(address _usersAddress) {
        s_users = Users(_usersAddress);
    }

    function createActivity(string memory _name, uint8 _reward)
        external
        onlyAdmin
    {
        address activityAddress = address(
            new Activity(_name, _reward, address(s_users))
        );
        s_activities.push(activityAddress);
        emit ActivityAdded(activityAddress);
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }
}
