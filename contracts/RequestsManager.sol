//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Authorization.sol";
import "./Model.sol";
import "./Requests.sol";
import "./Players.sol";

error RequestsManager__SelfReviewAttempt(address _adminAddress, uint256 _requestId);
error RequestsManager__StatusOutOfRange(address _adminAddress, uint256 _requestId, SharedModel.RequestStatus _status);

contract RequestsManager {
    event RequestReviewed(address indexed _reviewer, uint256 _requestId, SharedModel.RequestStatus _status);

    Authorization private s_authorization;
    Requests private s_requests;
    Players private s_players;

    constructor(Authorization _authorization, Requests _requests, Players _players) {
        s_authorization = _authorization;
        s_requests = _requests;
        s_players = _players;
    }

    modifier onlyRole(bytes32 _role) {
        // Probably we should create const for ADMIN role in this contract with byte value to lower gas price
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    function review(uint256 _requestId, SharedModel.RequestStatus _status) external onlyRole(s_authorization.ADMIN()) {
        SharedModel.Request memory request = s_requests.getRequest(_requestId);

        if(request.player == msg.sender) {
            revert RequestsManager__SelfReviewAttempt(msg.sender, _requestId);
        }

        s_requests.review(_requestId, _status);

        if(_status == SharedModel.RequestStatus.approved) {
            s_players.addPoints(request.player, request.points);
        }
        else if(_status == SharedModel.RequestStatus.rejected) {
            s_players.substractPoints(request.player, request.points);
        }
        else {
            revert RequestsManager__StatusOutOfRange(msg.sender, _requestId, _status);
        }

        emit RequestReviewed(msg.sender, _requestId, _status);
    }
}