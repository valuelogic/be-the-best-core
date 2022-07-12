//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Activity.sol";
import "./Authorization.sol";
import "./Model.sol";

error Requests__ActivityInactive(address player, address activity);
error Requests__AlreadyReviewed(uint requestId);

contract Requests {
    SharedModel.Request[] private s_requests;
    Authorization private s_authorization;

    event RequestAdded(address indexed player, address indexed activity);
    event RequestReviewed(address indexed player, address indexed activity, SharedModel.RequestStatus status);

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    modifier onlyRole(bytes32 _role) {
        // Probably we should create const for ADMIN role in this contract with byte value to lower gas price
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    // Maybe we should add const for PLAYER to lower gas cost for execution
    function request(address _activity) external onlyRole(s_authorization.PLAYER()) {
        Activity activity = Activity(_activity);
        if(!activity.isActive()) {
            revert Requests__ActivityInactive(msg.sender, _activity);
        }

        s_requests.push(SharedModel.Request({player: msg.sender, activity: _activity, points: activity.getReward(), status: SharedModel.RequestStatus.pending}));
        emit RequestAdded(msg.sender, _activity);
    }

    function review(uint _requestId, SharedModel.RequestStatus _status) external onlyRole(s_authorization.ADMIN()) {
        if (s_requests[_requestId].status != SharedModel.RequestStatus.pending) {
            revert Requests__AlreadyReviewed(_requestId);
        }

        s_requests[_requestId].status = _status;

        emit RequestReviewed(s_requests[_requestId].player, s_requests[_requestId].activity, _status);
    }

    function getRequest(uint _id) external view returns (SharedModel.Request memory) {
        return s_requests[_id];
    }

    function getRequests(SharedModel.RequestStatus _status) external view returns (SharedModel.Request[] memory) {
        uint256 resultCount = 0;

        for(uint256 i = 0; i < s_requests.length; i++) {
            if (s_requests[i].status == _status) {
                resultCount++;
            }
        }

        SharedModel.Request[] memory result = new SharedModel.Request[](resultCount);

        uint256 index;
        for (uint256 j = 0; j < s_requests.length; j++) {
            if (s_requests[j].status == _status) {
                result[index++] = s_requests[j];
            }
        }

        return result;
    }
}