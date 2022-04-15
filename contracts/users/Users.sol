//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../model/Model.sol";

contract Users {

    SharedModel.User[] users;

    function addUser(bool isAdmin, address walletAddress, string memory nick) public {
      users.push(
          SharedModel.User(
              isAdmin,
              walletAddress,
              0,
              nick)
        );
   }

   function getUsers() public view returns(SharedModel.User[] memory) {
       return users;
   }
}