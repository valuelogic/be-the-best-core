import {deployMockContract, MockContract, solidity} from "ethereum-waffle";
import {expect, use} from "chai";
import {deployments, ethers} from "hardhat";
import {Activity__factory, Authorization__factory, Requests, Requests__factory} from "../typechain-types";
import {BigNumber, Wallet} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

use(solidity);

describe('Requests contract', () => {
    describe('Deployment', () => {
        it('Should deploy the contract', async () => {
            await deployments.fixture(["authorization", "requests"]);
            const requestsContract = await ethers.getContract('Requests');
            expect(requestsContract.address).to.not.be.undefined;
        });
    });

    describe('Functionality', () => {
        let requestsContract : Requests;
        let authorization : MockContract;
        let deployer : SignerWithAddress;

        const playerBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('PLAYER'));
        const adminBytes = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));

        describe('Request reward', () => {
            beforeEach(async () => {
                deployer = await ethers.getNamedSigner('deployer');

                authorization = await deployMockContract(deployer, Authorization__factory.abi);

                await authorization.mock.PLAYER.returns(playerBytes);
                await authorization.mock.ADMIN.returns(adminBytes);
                await authorization.mock.ensureHasRole.withArgs(playerBytes, deployer.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, deployer.address).returns();

                requestsContract = await new Requests__factory(deployer).deploy(authorization.address);
            });

            it('Should revert when not registered user makes request', async() => {
                const [address] = await ethers.getUnnamedSigners();
                await authorization.mock.ensureHasRole.reverts();
                await expect(requestsContract.connect(address).request(Wallet.createRandom().address)).to.be.reverted;
            });

            it('Should revert when activity is inactive',  async () => {
                const activity = await deployMockContract(deployer, Activity__factory.abi);
                await activity.mock.isActive.returns(false);

                await expect(requestsContract.request(activity.address)).to.be.revertedWith('Requests__ActivityInactive');
            });

            it('Should create request', async () => {
                expect(await requestsContract.getRequests(BigNumber.from(0))).to.have.lengthOf(0);

                const activity = await deployMockContract(deployer, Activity__factory.abi);
                await activity.mock.isActive.returns(true);
                await activity.mock.getReward.returns(1);

                await requestsContract.request(activity.address);

                const requests = await requestsContract.getRequests(0); // 0 - pending
                expect(requests).to.have.lengthOf(1);
                expect(requests[0].activity).to.eq(activity.address);
                expect(requests[0].player).to.eq(deployer.address);
                expect(requests[0].points).to.eq(1);
            });

            it('Should emit event after creating request', async () => {
                const activity = await deployMockContract(deployer, Activity__factory.abi);
                await activity.mock.isActive.returns(true);
                await activity.mock.getReward.returns(1);

                await expect(requestsContract.request(activity.address)).to.emit(requestsContract, 'RequestAdded');
            });
        });

        describe('Review reward', () => {
            beforeEach(async () => {
                deployer = await ethers.getNamedSigner('deployer');

                authorization = await deployMockContract(deployer, Authorization__factory.abi);
                await authorization.mock.PLAYER.returns(playerBytes);
                await authorization.mock.ADMIN.returns(adminBytes);
                await authorization.mock.ensureHasRole.withArgs(playerBytes, deployer.address).returns();
                await authorization.mock.ensureHasRole.withArgs(adminBytes, deployer.address).returns();

                const activity1 = await deployMockContract(deployer, Activity__factory.abi);
                await activity1.mock.isActive.returns(true);
                await activity1.mock.getReward.returns(1);

                const activity2 = await deployMockContract(deployer, Activity__factory.abi);
                await activity2.mock.isActive.returns(true);
                await activity2.mock.getReward.returns(2);

                const activity3 = await deployMockContract(deployer, Activity__factory.abi);
                await activity3.mock.isActive.returns(true);
                await activity3.mock.getReward.returns(3);

                requestsContract = await new Requests__factory(deployer).deploy(authorization.address);

                await requestsContract.request(activity1.address);
                await requestsContract.request(activity2.address);
                await requestsContract.request(activity3.address);
            });

            it('Should change status to approved when approved', async() => {
                const approvedStatus = 1;

                expect(await requestsContract.getRequests(approvedStatus)).to.have.lengthOf(0);
                await requestsContract.review(0, approvedStatus);
                expect(await requestsContract.getRequests(approvedStatus)).to.have.lengthOf(1);
                expect(await requestsContract.getRequest(0)).to.haveOwnProperty('status', approvedStatus);
            });

            it('Should change status to rejected when rejected', async () => {
                const rejectedStatus = 2;

                expect(await requestsContract.getRequests(rejectedStatus)).to.have.lengthOf(0);
                await requestsContract.review(0, rejectedStatus);
                expect(await requestsContract.getRequests(rejectedStatus)).to.have.lengthOf(1);
                expect(await requestsContract.getRequest(0)).to.haveOwnProperty('status', rejectedStatus);
            });

            it('Should emit event when reviewed', async () => {
                const approvedStatus = 1;

                await expect(requestsContract.review(0, approvedStatus)).to.emit(requestsContract, 'RequestReviewed');
            });
        });
    });
});