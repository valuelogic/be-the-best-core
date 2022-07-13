//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Model.sol";
import "./Requests.sol";
import "./Authorization.sol";

    error Players__AccountNotRegistered(address _account);
    error Players__AccountAlreadyRegistered(address _account);

contract Players is Protected {
    mapping(address => SharedModel.Player) s_players;
    address[] s_addresses;
    Requests private s_requests;

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    constructor(Authorization _authorization) Protected(_authorization) {
    }

    // TODO: Think If this modifier is necessary as we can check If users has PLAYER role assigned
    modifier walletExists(address _walletAddress) {
        ensureWalletExists(_walletAddress);
        _;
    }

    modifier adminOrModifiedPlayer(address _player) {
        if(!s_authorization.hasRole(Roles.ADMIN, msg.sender) && !s_authorization.hasRole(Roles.PLAYER, msg.sender) && msg.sender != _player) {
            revert Players__UnauthorizedChangeAttempt(msg.sender, _player);
        }
        _;
    }

    function ensureWalletExists(address _walletAddress) public view {
        if (s_players[_walletAddress].walletAddress != _walletAddress) {
            revert Players__AccountNotRegistered(_walletAddress);
        }
    }

    function setNick(address _walletAddress, string memory _nick) public onlyRole(s_authorization.ADMIN()) walletExists(_walletAddress)
    {
        s_players[_walletAddress].nick = _nick;

        emit UpdatedPlayersNick(_walletAddress, _nick);
    }

    function addPlayer(
        address _walletAddress,
        string memory _nick
    ) external {
        if (s_players[_walletAddress].walletAddress == _walletAddress) {
            revert Players__AccountAlreadyRegistered(_walletAddress);
        }

        s_addresses.push(_walletAddress);
        s_players[_walletAddress] = SharedModel.Player(
            _walletAddress,
            _nick,
            0
        );

        emit AddedNewPlayer(_walletAddress, _nick);
    }

    function getPlayer(address _walletAddress)
    external
    view
    returns (SharedModel.Player memory)
    {
        return s_players[_walletAddress];
    }

    function getPlayers() external view returns (SharedModel.Player[] memory) {
        SharedModel.Player[] memory result = new SharedModel.Player[](
            s_addresses.length
        );
        for (uint256 i = 0; i < s_addresses.length; i++) {
            result[i] = s_players[s_addresses[i]];
        }
        return result;
    }

    function addPoints(address _player, uint32 _points)
    public
    onlyRole(Roles.ADMIN)
    walletExists(_player)
    {
        s_players[_player].points += _points;

        emit UpdatedPlayersPoints(_player, s_players[_player].points);
    }

    function substractPoints(address _player, uint32 _points)
    public
    onlyRole(Roles.ADMIN)
    walletExists(_player)
    {
        if (s_players[_player].points < _points) {
            s_players[_player].points = 0;
        } else {
            s_players[_player].points -= _points;
        }

        emit UpdatedPlayersPoints(_player, s_players[_player].points);
    }
}
