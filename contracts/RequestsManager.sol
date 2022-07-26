//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./libraries/Roles.sol";
import "./Authorization.sol";
import "./Model.sol";
import "./Requests.sol";
import "./Players.sol";
import "./Protected.sol";

error RequestsManager__SelfReviewAttempt(address _adminAddress, uint256 _requestId);
error RequestsManager__StatusOutOfRange(address _adminAddress, uint256 _requestId, SharedModel.RequestStatus _status);

contract RequestsManager is Protected {
    Requests private s_requests;
    Players private s_players;

    event RequestReviewed(address indexed _reviewer, uint256 _requestId, SharedModel.RequestStatus _status);

    constructor(Authorization _authorization, Requests _requests, Players _players) Protected(_authorization) {
        s_requests = _requests;
        s_players = _players;
    }

    function review(uint256 _requestId, SharedModel.RequestStatus _status) external onlyRole(Roles.ADMIN) {
        SharedModel.Request memory request = s_requests.getRequest(_requestId);

        if (request.player == msg.sender) {
            revert RequestsManager__SelfReviewAttempt(msg.sender, _requestId);
        }

        s_requests.review(_requestId, _status);

        if (_status == SharedModel.RequestStatus.approved) {
            s_players.addPoints(request.player, request.points);
        }
        else if (_status == SharedModel.RequestStatus.rejected) {
            s_players.substractPoints(request.player, request.points);
        }
        else {
            revert RequestsManager__StatusOutOfRange(msg.sender, _requestId, _status);
        }

        emit RequestReviewed(msg.sender, _requestId, _status);
    }
}