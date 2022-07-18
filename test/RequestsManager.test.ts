import {deployments, ethers, waffle} from "hardhat";
import {expect} from "chai";
import {
    Activity__factory,
    Authorization__factory,
    Players__factory,
    Requests__factory,
    RequestsManager,
    RequestsManager__factory
} from "../typechain-types";
import {MockContract} from "ethereum-waffle";
import {Wallet} from "ethers";

describe('RequestsManager Contract', () => {
    describe('Deployment', () => {
        it('Should deploy the contract', async () => {
            await deployments.fixture(["authorization", "requests", "players", "requestsManager"]);
            const requestsContract = await ethers.getContract('RequestsManager');
            expect(requestsContract.address).to.not.be.undefined;
        });
    });
    describe('Functionality', () => {
        let requestsManager : RequestsManager;
        let requests : MockContract;
        let authorization : MockContract;
        let deployer : Wallet;
        let activity : MockContract;
        let players : MockContract;
        let secondAdmin : Wallet;
        let nonAdmin : Wallet;

        const adminBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));
        const activityPoints = 1;
        const requestId = 0;

        describe('Review request', () => {
            beforeEach(async () => {
                [deployer, secondAdmin, nonAdmin] = waffle.provider.getWallets();

                authorization = await waffle.deployMockContract(deployer, Authorization__factory.abi);
                await authorization.mock.ADMIN.returns(adminBytes);
                await authorization.mock.ensureHasRole.withArgs(adminBytes, deployer.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, secondAdmin.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, nonAdmin.address).reverts();

                activity = await waffle.deployMockContract(deployer, Activity__factory.abi);

                requests = await waffle.deployMockContract(deployer, Requests__factory.abi);
                await requests.mock.review.withArgs(requestId, 1).returns();
                await requests.mock.review.withArgs(requestId, 2).returns();
                await requests.mock.getRequest.withArgs(requestId).returns({
                    player: deployer.address,
                    activity: activity.address,
                    points: activityPoints,
                    status: 0,
                });

                players = await waffle.deployMockContract(deployer, Players__factory.abi);
                await players.mock.addPoints.reverts();
                await players.mock.substractPoints.reverts();

                requestsManager = (await waffle.deployContract(deployer, RequestsManager__factory, [authorization.address, requests.address, players.address])) as RequestsManager;
            });

            it('Should revert when non-admin tries to review', async () => {
                await expect(requestsManager.connect(nonAdmin.address).review(requestId, 1)).to.be.reverted;
            });

            it('Should revert when admin tries to approve own request', async () => {
                await expect(requestsManager.review(requestId, 1)).to.be.revertedWith('RequestsManager__SelfReviewAttempt');
            });

            it('Should revert when status is out of range', async () => {
                await expect(requestsManager.connect(secondAdmin.address).review(requestId, 10)).to.be.revertedWith('RequestsManager__StatusOutOfRange');
            });

            it('should call addPoints when changing status to approved', async () => {
                await players.mock.addPoints.withArgs(deployer.address, activityPoints).returns();

                await expect(requestsManager.connect(secondAdmin).review(requestId, 1)).to.emit(requestsManager, 'RequestReviewed').withArgs(secondAdmin.address, requestId, 1);
            });

            it('should call substractPoints when changing status to rejected', async () => {
                await players.mock.substractPoints.withArgs(deployer.address, activityPoints).returns();

                await expect(requestsManager.connect(secondAdmin).review(requestId, 2)).to.emit(requestsManager, 'RequestReviewed').withArgs(secondAdmin.address, requestId, 2);
            });
        })
    });
});