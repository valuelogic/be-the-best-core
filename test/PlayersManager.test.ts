import {deployments, ethers} from "hardhat";
import {expect} from "chai";
import {
    Authorization,
    Players,
    PlayersManager
} from "../typechain-types";
import {ADMIN, PLAYER} from "../utils/roles";

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
            it('Should revert when called by non admin', async () => {
                const [newAccount, nonAdmin] = await ethers.getUnnamedSigners();

                await expect(playersManagerContract.connect(nonAdmin).addPlayer(newAccount.address, 'Nick', false))
                    .to.be.revertedWith('Authorization__MissingRole');
            });

            it('Should create player and user with player role only', async () => {
                const [account] = await ethers.getUnnamedSigners();

                await playersManagerContract.addPlayer(account.address, 'Nick', false);
                expect(await authorizationContract.hasRole(PLAYER, account.address)).to.be.true;
                expect(await authorizationContract.hasRole(ADMIN, account.address)).to.be.false;
                expect(await playersContract.getPlayer(account.address)).to.be.not.null;
            });

            it('Should create player and user with player & admin role', async () => {
                const [account] = await ethers.getUnnamedSigners();

                await playersManagerContract.addPlayer(account.address, 'Nick', true);
                expect(await authorizationContract.hasRole(PLAYER, account.address)).to.be.true;
                expect(await authorizationContract.hasRole(ADMIN, account.address)).to.be.true;
                expect(await playersContract.getPlayer(account.address)).to.be.not.null;
            });
        })
    });
});