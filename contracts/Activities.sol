//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract Activities {
    address[] public s_activities;

    event ActivityAdded(address activity);
    event ActivityDeleted(address activity);

    function addActivity(address activity) external {
        s_activities.push(activity);
        emit ActivityAdded(activity);
    }

    function getActivity(uint index) external indexInBounds(index) view returns (address) {
        return s_activities[index];
    }

    function getActivities() external view returns (address[] memory) {
        return s_activities;
    }

    function deleteActivity(uint index) external indexInBounds(index) {
        emit ActivityDeleted(s_activities[index]);
        s_activities[index] = s_activities[s_activities.length - 1];
        s_activities.pop();
    }

    modifier indexInBounds(uint index) {
        require(index < s_activities.length, 'Index out of bounds');
        _;
    }
}
