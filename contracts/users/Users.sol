//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../model/Model.sol";

contract Users {

    mapping(address => SharedModel.User) users;
    address[] public addresses;

    function addUser(address walletAddress, string memory nick, bool isAdmin) public {
      // TODO: check if walletAddress, nick are unique in users list
      addresses.push(walletAddress);
      users[walletAddress] = SharedModel.User(nick, 0, isAdmin);
   }

   function getUser(address walletAddress) public view returns(SharedModel.User memory) {
       return users[walletAddress];
   }

   function getUsers() public view returns (SharedModel.User[] memory){
      SharedModel.User[] memory result = new SharedModel.User[](addresses.length);
      for (uint i = 0; i < addresses.length; i++) {
          SharedModel.User storage user = users[addresses[i]];
          result[i] = user;
      }
      return result;
  }
}