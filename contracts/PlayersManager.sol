pragma solidity ^0.8.8;

import "./Authorization.sol";
import "./Players.sol";

contract PlayersManager {
    Authorization private s_authorization;
    Players private s_players;

    constructor(Authorization _authorization, Players _players) {
        s_authorization = _authorization;
        s_players = _players;
    }

    modifier onlyAdmin() {
        s_authorization.ensureHasRole(s_authorization.ADMIN(), msg.sender);
        _;
    }

    function addPlayer(address _account, string memory _nick, bool _isAdmin) external onlyAdmin {
        bytes32 adminRole = s_authorization.ADMIN();
        s_authorization.ensureHasRole(adminRole, msg.sender);

        s_players.addPlayer(_account, _nick);
        s_authorization.grantRole(s_authorization.PLAYER(), _account);
        if(_isAdmin) {
            s_authorization.grantRole(adminRole, _account);
        }
    }
}