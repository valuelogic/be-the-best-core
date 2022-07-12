import {deployments, ethers} from "hardhat";
import {expect} from "chai";
import {deployMockContract, MockContract} from "ethereum-waffle";
import {
    Activity__factory,
    Authorization__factory, Players__factory,
    Requests__factory,
    RequestsManager, RequestsManager__factory
} from "../typechain-types";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

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
        let deployer : SignerWithAddress;
        let activity : MockContract;
        let players : MockContract;
        let secondAdmin : SignerWithAddress;
        let nonAdmin : SignerWithAddress;

        const adminBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));
        const activityPoints = 1;
        const requestId = 0;

        describe('Review request', () => {
            beforeEach(async () => {
                deployer = await ethers.getNamedSigner('deployer');
                [secondAdmin, nonAdmin] = await ethers.getUnnamedSigners();

                authorization = await deployMockContract(deployer, Authorization__factory.abi);
                await authorization.mock.ADMIN.returns(adminBytes);
                await authorization.mock.ensureHasRole.withArgs(adminBytes, deployer.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, secondAdmin.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, nonAdmin.address).reverts();

                activity = await deployMockContract(deployer, Activity__factory.abi);

                requests = await deployMockContract(deployer, Requests__factory.abi);
                await requests.mock.review.withArgs(requestId, 1).returns();
                await requests.mock.review.withArgs(requestId, 2).returns();
                await requests.mock.getRequest.withArgs(requestId).returns({
                    player: deployer.address,
                    activity: activity.address,
                    points: activityPoints,
                    status: 0,
                });

                players = await deployMockContract(deployer, Players__factory.abi);
                await players.mock.addPoints.reverts();
                await players.mock.substractPoints.reverts();

                requestsManager = await new RequestsManager__factory(deployer).deploy(authorization.address, requests.address, players.address);
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

                expect(await requestsManager.connect(secondAdmin).review(requestId, 1)).to.be.undefined;
            });

            it('should call substractPoints when changing status to rejected', async () => {
                await players.mock.substractPoints.withArgs(deployer.address, activityPoints).returns();

                await requestsManager.connect(secondAdmin).review(requestId, 2);
                expect('substractPoints').to.be.calledOnContractWith(requests, [requestId, 2]);
            });
        })
    });
});