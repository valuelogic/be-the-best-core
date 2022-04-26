//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Activity {
    string public name;
    uint8 public reward;

    event RewardChanged(string indexed _name, uint8 _oldReward, uint8 _newReward);
    event NameChanged(string indexed _oldName, string indexed _newName);

    constructor(string memory _name, uint8 _reward) {
        require(bytes(_name).length > 0, "Name must be non-empty");
        require(_reward > 0, "Reward must be greater than 0");

        name = _name;
        reward = _reward;
    }

    function setName(string memory _newName) public {
        require(bytes(_newName).length > 0, "Name must be non-empty");
        emit NameChanged(name, _newName);
        name = _newName;
    }

    function setReward(uint8 _reward) public {
        require(_reward > 0, "Reward must be greater than 0");
        require(_reward != reward, "Reward must be different");

        // todo: reward can be modified only by the admin
        emit RewardChanged(name, reward, _reward);
        reward = _reward;
    }
}
