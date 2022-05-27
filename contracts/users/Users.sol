//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../model/Model.sol";

contract Users {

    mapping(address => SharedModel.User) s_users;
    address[] public s_addresses;

    event AddedNewUser(address walletAddress, string nick, bool isAdmin);
    event UpdatedUsersPoints(address walletAddress, uint16 current_points);

    constructor() {
        addUser(msg.sender, '', true);
    }

    // TODO: setter na isAdmin 

    // TODO: setter na nick

    function addUser(address walletAddress, string memory nick, bool isAdmin) public {
      require(s_users[walletAddress].walletAddress != walletAddress, "Wallet address already exists");
      s_addresses.push(walletAddress);
      s_users[walletAddress] = SharedModel.User(walletAddress, nick, 0, isAdmin);
      emit AddedNewUser(s_users[walletAddress].walletAddress, s_users[walletAddress].nick, s_users[walletAddress].isAdmin);
   }

   function getUser(address walletAddress) public view returns(SharedModel.User memory) {
       return s_users[walletAddress];
   }

   function getUsers() public view returns (SharedModel.User[] memory){
      SharedModel.User[] memory result = new SharedModel.User[](s_addresses.length);
      for (uint i = 0; i < s_addresses.length; i++) {
          SharedModel.User storage user = s_users[s_addresses[i]];
          result[i] = user;
      }
      return result;
  }

   // TODO: make addPoints param int16 points

   function addPoints(address walletAddress, uint16 points) public {
       require(s_users[walletAddress].walletAddress == walletAddress, "User with passed wallet not exists");
       require(points > 0, "Points must be positive number");
       require(s_users[msg.sender].isAdmin, "msg sender must be admin");
       s_users[walletAddress].points = s_users[walletAddress].points + points;
       emit UpdatedUsersPoints(walletAddress, s_users[walletAddress].points);
   }
}