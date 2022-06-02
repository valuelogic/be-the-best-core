//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "../users/Users.sol";

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
        require(s_users.getUser(msg.sender).isAdmin, "You are not an admin.");
        _;
    }

    constructor(
        string memory _name,
        uint8 _reward,
        address _usersAddress
    ) {
        require(bytes(_name).length > 0, "Name must be non-empty");
        require(_reward > 0, "Reward must be greater than 0");

        s_active = false;
        s_name = _name;
        s_reward = _reward;
        s_users = Users(_usersAddress);
    }

    function isActive() external view returns (bool) {
        return s_active;
    }

    function setName(string memory _newName) external onlyAdmin {
        require(bytes(_newName).length > 0, "Name must be non-empty");
        emit NameChanged(s_name, _newName);
        s_name = _newName;
    }

    function setReward(uint8 _reward) external onlyAdmin {
        require(_reward > 0, "Reward must be greater than 0");
        require(_reward != s_reward, "Reward must be different");

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
