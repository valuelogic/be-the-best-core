//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Authorization.sol";

error Activity__EmptyName();
error Activity__ZeroReward();

contract Activity {
    event RewardChanged(uint8 _oldReward, uint8 _newReward);
    event NameChanged(string _oldName, string _newName);
    event Activated();
    event Deactivated();

    bool s_active;
    uint8 public s_reward;
    Authorization s_authorization;
    string public s_name;

    constructor(
        string memory _name,
        uint8 _reward,
        bool _active,
        Authorization _authorizationAddress
    ) {
        if (bytes(_name).length == 0) {
            revert Activity__EmptyName();
        }

        if (_reward == 0) {
            revert Activity__ZeroReward();
        }

        s_name = _name;
        s_reward = _reward;
        s_active = _active;
        s_authorization = _authorizationAddress;
    }

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    function isActive() external view returns (bool) {
        return s_active;
    }

    function setName(string memory _newName) external onlyRole(s_authorization.ADMIN()) {
        if (bytes(_newName).length == 0) {
            revert Activity__EmptyName();
        }
        emit NameChanged(s_name, _newName);
        s_name = _newName;
    }

    function setReward(uint8 _reward) external onlyRole(s_authorization.ADMIN()) {
        if (_reward == 0) {
            revert Activity__ZeroReward();
        }

        emit RewardChanged(s_reward, _reward);
        s_reward = _reward;
    }

    function getReward() external view returns (uint8) {
        return s_reward;
    }

    function deactivate() external onlyRole(s_authorization.ADMIN()) {
        s_active = false;
        emit Deactivated();
    }

    function activate() external onlyRole(s_authorization.ADMIN()) {
        s_active = true;
        emit Activated();
    }
}
