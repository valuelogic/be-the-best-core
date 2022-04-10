//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../../model/User.sol";

contract Users {

    User[] users;

    function addUser(bool isAdmin, address walletAddress, string memory nick) public {
      users.push(
          User(
              isAdmin,
              walletAddress,
              0,
              nick)
        );
   }

   function getUsers() public view returns(User[] memory) {
       return users;
   }
}