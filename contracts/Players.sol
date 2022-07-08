//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Model.sol";
import "./Requests.sol";
import "./Authorization.sol";

error Players__AccountNotRegistered(address _account);
error Players__AccountAlreadyRegistered(address _account);

contract Players {
    mapping(address => SharedModel.Player) s_players;
    address[] s_addresses;
    Requests private s_requests;
    Authorization private s_authorization;

    event AddedNewPlayer(address indexed walletAddress, string nick);
    event UpdatedPlayersPoints( address indexed walletAddress, uint32 currentPoints);
    event UpdatedPlayersNick(address indexed _walletAddress, string _newNick);

    modifier onlyRole(bytes32 _role) {
        s_authorization.ensureHasRole(_role, msg.sender);
        _;
    }

    modifier walletExists(address _walletAddress) {
        ensureWalletExists(_walletAddress);
        _;
    }

    constructor(Authorization _authorization) {
        s_authorization = _authorization;
    }

    function ensureWalletExists(address _walletAddress) public view {
        if (s_players[_walletAddress].walletAddress != _walletAddress) {
            revert Players__AccountNotRegistered(_walletAddress);
        }
    }

    function setNick(address _walletAddress, string memory _nick)
        public
        onlyRole(s_authorization.ADMIN())
        walletExists(_walletAddress)
    {
        s_players[_walletAddress].nick = _nick;

        emit UpdatedPlayersNick(_walletAddress, _nick);
    }

    function addPlayer(
        address _walletAddress,
        string memory _nick
    ) external {
        if(s_players[_walletAddress].walletAddress == _walletAddress) {
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
        // TODO: check if admin is not a requester
        // TODO: Move changing request status to RequestReviewer contract
//        s_requests.review(_requestId, SharedModel.RequestStatus.approved);
//        SharedModel.Request memory request = s_requests.getRequest(_requestId);

        s_players[_player].points += _points;

        emit UpdatedPlayersPoints(_player, s_players[_player].points);
    }

    function substractPoints(address _player, uint32 _points)
        public
        onlyRole(s_authorization.ADMIN())
        walletExists(_player)
    {
        // TODO: Move changing request status to RequestReviewer contract
//        s_requests.review(_requestId, SharedModel.RequestStatus.approve d);
//        SharedModel.Request memory request = s_requests.getRequest(_requestId);

        if (s_players[_player].points < _points) {
            s_players[_player].points = 0;
        } else {
            s_players[_player].points -= _points;
        }

        emit UpdatedPlayersPoints(_player, s_players[_player].points);
    }
}
