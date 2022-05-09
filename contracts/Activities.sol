//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Activity.sol";

contract Activities {
    Activity[] public activities;

    constructor() {
        activities = new Activity[](0);
    }

    function addActivity(Activity activity) public {
        activities.push(activity);
    }

    function getActivity(uint index) public view returns (Activity) {
        return activities[index];
    }

    function getActivities() public view returns (Activity[] memory) {
        return activities;
    }

    function updateActivity(uint index, Activity activity) public {
        activities[index] = activity;
    }

    function deleteActivity(uint index) public {
        activities[index] = activities[activities.length - 1];
        activities.pop();
    }
}
