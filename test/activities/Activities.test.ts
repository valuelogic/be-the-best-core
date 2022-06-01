import {deployContract, deployMockContract, MockProvider, solidity} from "ethereum-waffle";
import {expect, use} from "chai";
import ContractJson from "../../artifacts/contracts/activities/Activities.sol/Activities.json";
import {Activities, Activities__factory, Activity__factory} from "../../typechain-types";
import {ethers} from "hardhat";

use(solidity);

describe('Activities contract', () => {
    describe('deploy', () => {
        let [wallet] = new MockProvider().getWallets();

        it('should deploy the contract', async () => {
            const contract = await deployContract(wallet, ContractJson, [], {gasLimit: 1000000});
            expect(contract.address).to.not.be.undefined;
        });
    });

    describe('add activity', async () => {
        let contract: Activities;
        let [wallet] = new MockProvider().getWallets();

        beforeEach(async () => {
            const factory = await ethers.getContractFactory<Activities__factory>('Activities', wallet);
            contract = await factory.deploy();
        });

        it('should emit ActivityAdded event', async () => {
            const activity = await deployMockContract(wallet, Activity__factory.abi);

            await expect(contract.addActivity(activity.address, {gasLimit: 1000000}))
                .to.emit(contract, 'ActivityAdded').withArgs(activity.address);
        });
    });

    describe('get activities', () => {
        let contract: Activities;
        let [wallet] = new MockProvider().getWallets();

        beforeEach(async () => {
            const factory = await ethers.getContractFactory<Activities__factory>('Activities', wallet);
            contract = await factory.deploy();
        });

        it('should return an empty array', async () => {
            const activities = await contract.getActivities();
            expect(activities.length).to.equal(0);
        });

        it('should return an array with one activity', async () => {
            const activity1 = await deployMockContract(wallet, Activity__factory.abi);
            const activity2 = await deployMockContract(wallet, Activity__factory.abi);

            await contract.addActivity(activity1.address, {gasLimit: 1000000});
            await contract.addActivity(activity2.address, {gasLimit: 1000000});

            const activities = await contract.getActivities();
            expect(activities.length).to.equal(2);
        });
    });

    describe('get activity', () => {
        let contract: Activities;
        let [wallet] = new MockProvider().getWallets();

        beforeEach(async () => {
            const factory = await ethers.getContractFactory<Activities__factory>('Activities', wallet);
            contract = await factory.deploy();
        })

        it('should revert transaction when does not exist', async () => {
            await expect(contract.getActivity(0)).to.be.revertedWith('Index out of bounds');
        })

        it('should return the activity', async () => {
            const activity1 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity1.address, {gasLimit: 1000000});

            const activity2 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity2.address, {gasLimit: 1000000});

            const activityAddress = await contract.getActivity(1);
            expect(activityAddress).to.equal(activity2.address);
        })
    });

    describe('delete activity', async () => {
        const [wallet] = new MockProvider().getWallets();
        let contract: Activities;

        beforeEach(async () => {
            const factory = await ethers.getContractFactory<Activities__factory>('Activities', wallet);
            contract = await factory.deploy();
        })

        it('should revert transaction when does not exist', async () => {
            await expect(contract.deleteActivity(0, {gasLimit: 1000000})).to.be.revertedWith('Index out of bounds');
        });

        it('should delete activity', async () => {
            const activity1 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity1.address, {gasLimit: 1000000});

            const activity2 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity2.address, {gasLimit: 1000000});

            await contract.deleteActivity(1, {gasLimit: 1000000});
            const activities = await contract.getActivities();
            expect(activities.length).to.equal(1);
            expect(activities[0]).to.equal(activity1.address);
        });

        it('should emit event', async () => {
            const activity1 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity1.address, {gasLimit: 1000000});

            const activity2 = await deployMockContract(wallet, Activity__factory.abi);
            await contract.addActivity(activity2.address, {gasLimit: 1000000});

            await expect(contract.deleteActivity(1, {gasLimit: 1000000}))
                .to.emit(contract, 'ActivityDeleted').withArgs(activity2.address);
        });
    });
});