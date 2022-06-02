//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

contract Activity {
    string public name;
    uint8 public reward;

    event RewardChanged(uint8 _oldReward, uint8 _newReward);
    event NameChanged(string _oldName, string _newName);

    constructor(string memory _name, uint8 _reward) {
        require(bytes(_name).length > 0, "Name must be non-empty");
        require(_reward > 0, "Reward must be greater than 0");

        name = _name;
        reward = _reward;
    }

    function setName(string memory _newName) external {
        require(bytes(_newName).length > 0, "Name must be non-empty");
        emit NameChanged(name, _newName);
        name = _newName;
    }

    function setReward(uint8 _reward) external {
        require(_reward > 0, "Reward must be greater than 0");
        require(_reward != reward, "Reward must be different");

        // todo: reward can be modified only by the admin
        emit RewardChanged(reward, _reward);
        reward = _reward;
    }
}
