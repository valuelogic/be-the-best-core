pragma solidity ^0.8.8;

import "./Authorization.sol";
import "./Players.sol";
import "./libraries/Roles.sol";

contract PlayersManager is Protected {
    Players private s_players;

    constructor(Authorization _authorization, Players _players) Protected(_authorization) {
        s_players = _players;
    }

    function addPlayer(address _account, string memory _nick, bool _isAdmin) external onlyRole(Roles.ADMIN) {
        s_players.addPlayer(_account, _nick);
        s_authorization.grantRole(Roles.PLAYER, _account);
        if(_isAdmin) {
            s_authorization.grantRole(Roles.ADMIN, _account);
        }
    }
}