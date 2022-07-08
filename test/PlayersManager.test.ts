import {deployments, ethers} from "hardhat";
import {expect} from "chai";
import {
    Authorization,
    Players,
    PlayersManager
} from "../typechain-types";

describe('PlayersManager contract', () => {
    let authorizationContract: Authorization;
    let playersContract: Players;
    let playersManagerContract: PlayersManager;

    beforeEach(async () => {
        await deployments.fixture(["authorization", "players", "playersManager"]);
        playersContract = await ethers.getContract('Players');
        playersManagerContract = await ethers.getContract("PlayersManager");
        authorizationContract = await ethers.getContract("Authorization");
    });

    describe('Deployment', () => {
        it('Should deploy', async () => {
            expect(playersManagerContract).not.to.be.null;
        });
    });

    describe('Functionality', () => {
        describe('Add player', () => {
            it('Should create player and user with player role only', async () => {
                const [account] = await ethers.getUnnamedSigners();

                const playerRoleBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLAYER'));
                const adminRoleBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));

                await playersManagerContract.addPlayer(account.address, 'Nick', false);
                expect(await authorizationContract.hasRole(playerRoleBytes, account.address)).to.be.true;
                expect(await authorizationContract.hasRole(adminRoleBytes, account.address)).to.be.false;
                expect(await playersContract.getPlayer(account.address)).to.be.not.null;
            });

            it('Should create player and user with player & admin role', async () => {
                const [account] = await ethers.getUnnamedSigners();

                const playerRoleBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLAYER'));
                const adminRoleBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));

                await playersManagerContract.addPlayer(account.address, 'Nick', true);
                expect(await authorizationContract.hasRole(playerRoleBytes, account.address)).to.be.true;
                expect(await authorizationContract.hasRole(adminRoleBytes, account.address)).to.be.true;
                expect(await playersContract.getPlayer(account.address)).to.be.not.null;
            });
        })
    });
});