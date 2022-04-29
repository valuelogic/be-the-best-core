//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../model/Model.sol";

contract Users {

    mapping(address => SharedModel.User) s_users;
    address[] public s_addresses;

    function addUser(address walletAddress, string memory nick, bool isAdmin) public {
      // TODO: check if walletAddress, nick are unique in s_users list
      s_addresses.push(walletAddress);
      s_users[walletAddress] = SharedModel.User(walletAddress, nick, 0, isAdmin);
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
}