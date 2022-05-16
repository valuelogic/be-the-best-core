//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Activity.sol";

contract Activities {
    Activity[] public activities;

    event ActivityAdded(uint256 index, Activity activity);
    event ActivityDeleted(uint256 index);
    event ActivityUpdated(uint256 index, Activity oldActivity, Activity newActivity);

    constructor() {
        activities = new Activity[](0);
    }

    function addActivity(Activity activity) external {
        activities.push(activity);
        emit ActivityAdded(activities.length - 1, activity);
    }

    function getActivity(uint index) external indexInBounds(index) view returns (Activity) {
        return activities[index];
    }

    function getActivities() external view returns (Activity[] memory) {
        return activities;
    }

    function updateActivity(uint index, Activity activity) external indexInBounds(index) {
        emit ActivityUpdated(index, activities[index], activity);
        activities[index] = activity;
    }

    function deleteActivity(uint index) external indexInBounds(index) {
        activities[index] = activities[activities.length - 1];
        activities.pop();
        emit ActivityDeleted(index);
    }

    modifier indexInBounds(uint index) {
        require(index < activities.length, 'Index out of bounds');
        _;
    }
}
