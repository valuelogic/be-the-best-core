//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Activity {
    event ActivityCreated(string indexed _name, uint _reward);
    event RewardChanged(string indexed _name, uint _oldReward, uint _newReward);
    event NameChanged(string indexed _oldName, string indexed _newName);

    string public name;
    uint public reward;

    constructor(string memory _name, uint _reward) {
        require(bytes(_name).length > 0, "Name must be non-empty");
        require(_reward > 0, "Reward must be greater than 0");

        name = _name;
        reward = _reward;
        emit ActivityCreated(name, reward);
    }

    function setName(string memory _newName) public {
        require(bytes(_newName).length > 0, "Name must be non-empty");
        name = _newName;
        emit ActivityCreated(name, reward);
    }

    function setReward(uint _reward) public {
        require(_reward > 0, "Reward must be greater than 0");
        require(_reward != reward, "Reward must be different");

        // todo: reward can be modified only by the admin
        emit RewardChanged(name, reward, _reward);
        reward = _reward;
    }
}
