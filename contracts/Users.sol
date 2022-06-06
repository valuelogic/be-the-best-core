//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.8;

import "./Model.sol";

error Users__NotAnAdmin(address _wallet);
error Users_WalletNotExists(address _wallet);
error Users_WalletAlreadyExists(address _wallet);

contract Users {
    mapping(address => SharedModel.User) s_users;
    address[] s_addresses;

    event AddedNewUser(
        address indexed walletAddress,
        string nick,
        bool isAdmin
    );
    event UpdatedUsersPoints(
        address indexed walletAddress,
        uint32 currentPoints
    );
    event UpdatedUsersNick(address indexed _walletAddress, string _newNick);
    event UpdatedUsersAdminRole(address indexed _walletAddress, bool _isAdmin);

    modifier onlyAdmin() {
        ensureIsAdmin(msg.sender);
        _;
    }

    modifier walletExists(address _walletAddress) {
        ensureWalletExists(_walletAddress);
        _;
    }

    constructor() {
        addUser(msg.sender, "", true);
    }

    function ensureIsAdmin(address _walletAddress) public view {
        if (!s_users[_walletAddress].isAdmin) {
            revert Users__NotAnAdmin(_walletAddress);
        }
    }

    function ensureWalletExists(address _walletAddress) public view {
        if (s_users[_walletAddress].walletAddress != _walletAddress) {
            revert Users_WalletNotExists(_walletAddress);
        }
    }

    function setAdmin(address _walletAddress, bool _isAdmin)
        public
        onlyAdmin
        walletExists(_walletAddress)
    {
        s_users[_walletAddress].isAdmin = _isAdmin;
        emit UpdatedUsersAdminRole(_walletAddress, _isAdmin);
    }

    function setNick(address _walletAddress, string memory _nick)
        public
        onlyAdmin
        walletExists(_walletAddress)
    {
        s_users[_walletAddress].nick = _nick;

        emit UpdatedUsersNick(_walletAddress, _nick);
    }

    function addUser(
        address _walletAddress,
        string memory _nick,
        bool _isAdmin
    ) public {
        if(s_users[_walletAddress].walletAddress == _walletAddress) {
            revert Users_WalletAlreadyExists(_walletAddress);
        }
        

        s_addresses.push(_walletAddress);
        s_users[_walletAddress] = SharedModel.User(
            _walletAddress,
            _nick,
            0,
            _isAdmin
        );

        emit AddedNewUser(_walletAddress, _nick, _isAdmin);
    }

    function getUser(address _walletAddress)
        public
        view
        returns (SharedModel.User memory)
    {
        return s_users[_walletAddress];
    }

    function getUsers() public view returns (SharedModel.User[] memory) {
        SharedModel.User[] memory result = new SharedModel.User[](
            s_addresses.length
        );
        for (uint256 i = 0; i < s_addresses.length; i++) {
            result[i] = s_users[s_addresses[i]];
        }
        return result;
    }

    function addPoints(address _walletAddress, uint32 _points)
        public
        onlyAdmin
        walletExists(_walletAddress)
    {
        s_users[_walletAddress].points += _points;

        emit UpdatedUsersPoints(_walletAddress, s_users[_walletAddress].points);
    }

    function substractPoints(address _walletAddress, uint32 _points)
        public
        onlyAdmin
        walletExists(_walletAddress)
    {
        if (s_users[_walletAddress].points < _points) {
            s_users[_walletAddress].points = 0;
        } else {
            s_users[_walletAddress].points -= _points;
        }

        emit UpdatedUsersPoints(_walletAddress, s_users[_walletAddress].points);
    }
}
