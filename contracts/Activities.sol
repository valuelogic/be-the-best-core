//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract Activities {
    address[] public s_activities;

    event ActivityAdded(uint256 index, address activity);
    event ActivityDeleted(uint256 index);
    event ActivityUpdated(uint256 index, address oldActivity, address newActivity);

    function addActivity(address activity) external {
        s_activities.push(activity);
        emit ActivityAdded(s_activities.length - 1, activity);
    }

    function getActivity(uint index) external indexInBounds(index) view returns (address) {
        return s_activities[index];
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }

    function updateActivity(uint index, address activity) external indexInBounds(index) {
        emit ActivityUpdated(index, s_activities[index], activity);
        s_activities[index] = activity;
    }

    function deleteActivity(uint index) external indexInBounds(index) {
        s_activities[index] = s_activities[s_activities.length - 1];
        s_activities.pop();
        emit ActivityDeleted(index);
    }

    modifier indexInBounds(uint index) {
        require(index < s_activities.length, 'Index out of bounds');
        _;
    }
}
