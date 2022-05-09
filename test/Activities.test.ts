import {deployContract, deployMockContract, MockProvider} from "ethereum-waffle";
import {Wallet} from "ethers";
import {expect} from "chai";
import ContractJson from "../artifacts/contracts/Activities.sol/Activities.json";
import {Activities, Activities__factory, Activity, Activity__factory} from "../typechain-types";
import {ethers} from "hardhat";
import exp from "constants";

describe('Activities contract', () => {
    describe('deploy', () => {
        let wallet: Wallet;

        beforeEach(() => {
            [wallet] = new MockProvider().getWallets();
        })

        it('should deploy the contract', async () => {
            const contract = await deployContract(wallet, ContractJson, [], {gasLimit: 1000000});
            expect(contract.address).to.not.be.undefined;
        });
    });

    describe('addActivity', async () => {
        let contract: Activities;
        let wallet: Wallet;

        beforeEach(async () => {
            [wallet] = new MockProvider().getWallets();
            const factory = await ethers.getContractFactory<Activities__factory>('Activities', wallet);
            contract = await factory.deploy();
        });

        it('should add an activity', async () => {
            const activity = await deployMockContract(wallet, Activity__factory.abi);

            await contract.addActivity(activity.address);
            const activities = await contract.getActivities();
            expect(activities.length).to.equal(1);
        });
    });
});