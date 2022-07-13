//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Authorization.sol";
import "./libraries/Roles.sol";
import "./Protected.sol";

error Activity__EmptyName();
error Activity__ZeroReward();

contract Activity is Protected {
    bool s_active;
    uint8 public s_reward;
    string public s_name;

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
    ) Protected(_authorizationAddress) {
        if (bytes(_name).length == 0) {
            revert Activity__EmptyName();
        }

        if (_reward == 0) {
            revert Activity__ZeroReward();
        }

        s_name = _name;
        s_reward = _reward;
        s_active = _active;
    }

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    function isActive() external view returns (bool) {
        return s_active;
    }

    function setName(string memory _newName) external onlyRole(Roles.ADMIN) {
        if (bytes(_newName).length == 0) {
            revert Activity__EmptyName();
        }
        emit NameChanged(s_name, _newName);
        s_name = _newName;
    }

    function setReward(uint8 _reward) external onlyRole(Roles.ADMIN) {
        if (_reward == 0) {
            revert Activity__ZeroReward();
        }

        emit RewardChanged(s_reward, _reward);
        s_reward = _reward;
    }

    function getReward() external view returns (uint8) {
        return s_reward;
    }

    function deactivate() external onlyRole(Roles.ADMIN) {
        s_active = false;
        emit Deactivated();
    }

    function activate() external onlyRole(Roles.ADMIN) {
        s_active = true;
        emit Activated();
    }
}
