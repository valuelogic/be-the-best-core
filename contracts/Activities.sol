//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract Activities {
    address[] public activities;

    event ActivityAdded(uint256 index, address activity);
    event ActivityDeleted(uint256 index);
    event ActivityUpdated(uint256 index, address oldActivity, address newActivity);

    function addActivity(address activity) external {
        activities.push(activity);
        emit ActivityAdded(activities.length - 1, activity);
    }

    function getActivity(uint index) external indexInBounds(index) view returns (address) {
        return activities[index];
    }

    function getActivities() external view returns (address[] memory) {
        return activities;
    }

    function updateActivity(uint index, address activity) external indexInBounds(index) {
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
