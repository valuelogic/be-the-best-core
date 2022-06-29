//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Users.sol";

error Activity__EmptyName();
error Activity__ZeroReward();

contract Activity {
    bool s_active;
    uint8 public s_reward;
    Users s_users;
    string public s_name;

    event RewardChanged(uint8 _oldReward, uint8 _newReward);
    event NameChanged(string _oldName, string _newName);
    event Activated();
    event Deactivated();

    modifier onlyAdmin() {
        s_users.ensureIsAdmin(msg.sender);
        _;
    }

    constructor(
        string memory _name,
        uint8 _reward,
        bool _active,
        address _usersAddress
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
        s_users = Users(_usersAddress);
    }

    function isActive() external view returns (bool) {
        return s_active;
    }

    function setName(string memory _newName) external onlyAdmin {
        if (bytes(_newName).length == 0) {
            revert Activity__EmptyName();
        }
        emit NameChanged(s_name, _newName);
        s_name = _newName;
    }

    function setReward(uint8 _reward) external onlyAdmin {
        if (_reward == 0) {
            revert Activity__ZeroReward();
        }

        emit RewardChanged(s_reward, _reward);
        s_reward = _reward;
    }

    function deactivate() external onlyAdmin {
        s_active = false;
        emit Deactivated();
    }

    function activate() external onlyAdmin {
        s_active = true;
        emit Activated();
    }
}
