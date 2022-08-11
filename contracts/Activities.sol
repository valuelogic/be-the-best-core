//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Activity.sol";
import "./Authorization.sol";
import "./libraries/Roles.sol";
import "./Protected.sol";

contract Activities is Protected {
    struct ActivityDto {
        address contractAddress;
        string name;
        uint8 reward;
        bool isActive;
    }

    Activity[] private s_activities;

    event ActivityCreated(Activity activity);

    constructor(Authorization _authorizationAddress) Protected(_authorizationAddress) {
    }

    function createActivity(string memory _name, uint8 _reward, bool _active) external onlyRole(Roles.ADMIN)
    {
        Activity activityAddress = new Activity(_name, _reward, _active, s_authorization);
        s_activities.push(activityAddress);
        emit ActivityCreated(activityAddress);
    }

    function getActivities() external view returns (ActivityDto[] memory) {
        uint256 activitiesLength = s_activities.length;

        ActivityDto[] memory response = new ActivityDto[](activitiesLength);
        for(uint256 i = 0; i < activitiesLength; i++) {
            Activity activity = s_activities[i];
            response[i] = ActivityDto({contractAddress: address(activity), name: activity.s_name(), reward: activity.getReward(), isActive: activity.isActive()});
        }

        return response;
    }
}
