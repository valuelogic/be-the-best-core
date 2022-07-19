//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Model.sol";
import "./Requests.sol";
import "./Authorization.sol";

error Players__AccountNotRegistered(address _player);
error Players__AccountAlreadyRegistered(address _player);
error Players__UnauthorizedChangeAttempt(address _modifier, address _player);

contract Players {
    event AddedNewPlayer(address indexed walletAddress, string nick);
    event UpdatedPlayersPoints(address indexed walletAddress, uint32 currentPoints);
    event UpdatedPlayersNick(address indexed _walletAddress, string _newNick);

    mapping(address => SharedModel.Player) s_players;
    address[] s_addresses;
    Requests private s_requests;
    Authorization private s_authorization;

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    // This modifier and check may not be necessary as we can check If users has PLAYER role assigned
    modifier walletExists(address _walletAddress) {
        ensureWalletExists(_walletAddress);
        _;
    }

    modifier adminOrModifiedPlayer(address _player) {
        if(!s_authorization.hasRole(s_authorization.ADMIN(), msg.sender) && !s_authorization.hasRole(s_authorization.PLAYER(), msg.sender) && msg.sender != _player) {
            revert Players__UnauthorizedChangeAttempt(msg.sender, _player);
        }
        _;
    }

    function ensureWalletExists(address _walletAddress) public view {
        if (s_players[_walletAddress].walletAddress != _walletAddress) {
            revert Players__AccountNotRegistered(_walletAddress);
        }
    }

    function setNick(address _walletAddress, string memory _nick) public adminOrModifiedPlayer(_walletAddress) walletExists(_walletAddress)
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
    onlyRole(s_authorization.ADMIN())
    walletExists(_player)
    {
        s_players[_player].points += _points;

        emit UpdatedPlayersPoints(_player, s_players[_player].points);
    }

    function substractPoints(address _player, uint32 _points)
    public
    onlyRole(s_authorization.ADMIN())
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
