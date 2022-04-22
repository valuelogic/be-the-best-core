//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./../model/Model.sol";

contract Users {

    SharedModel.User[] users;

    function addUser(address walletAddress, string memory nick, bool isAdmin) public {
      users.push(
          SharedModel.User(
              walletAddress,
              nick,
              0,
              isAdmin)
        );
   }

   function getUsers() public view returns(SharedModel.User[] memory) {
       return users;
   }
}