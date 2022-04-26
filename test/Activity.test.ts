import {expect, use} from "chai";
import {ethers} from "hardhat";
import {BigNumber, Wallet} from "ethers";
import {deployContract, MockProvider, solidity} from "ethereum-waffle";
import ContractJson from "../artifacts/contracts/Activity.sol/Activity.json";
import { Activity__factory, Activity } from "../typechain-types";

use(solidity);

describe('Activity contract', async () => {
    describe('deploy', async () => {
        let wallet: Wallet;

        beforeEach(() => {
            [wallet] = new MockProvider().getWallets();
        });

        it('Should revert when deploying contract with empty name', async () => {
            await expect(deployContract(wallet, ContractJson, ['', 10]))
                .to.be.revertedWith('Name must be non-empty');
        });

        it('Should revert when deploying contract with zero score', async () => {
            await expect(deployContract(wallet, ContractJson, ['Name', 0]))
                .to.be.revertedWith('Reward must be greater than 0');
        });

        it('Should deploy contract with given name and reward', async () => {
            const factory = await ethers.getContractFactory('Activity', wallet);

            const activity = await factory.deploy('Name', BigNumber.from(1));
            const name = await activity.name({gasLimit: 100000});
            const reward = await activity.reward({gasLimit: 100000});

            expect(name).to.equal('Name');
            expect(reward).to.deep.equal(BigNumber.from(1));
        });
    });

    describe('set reward', async () => {
        let activity: Activity;

        beforeEach(async () => {
            const [wallet] = await ethers.getSigners();
            const factory = await ethers.getContractFactory<Activity__factory>('Activity', wallet);
            activity = await factory.deploy('Name', BigNumber.from(1));
        })

        it('Should change reward', async () => {
            await activity.setReward(20);
            const reward = await activity.reward();

            expect(reward).to.deep.equal(BigNumber.from(20));
        });

        it('Should emit event after changing reward', async () => {
            await expect(activity.setReward(20)).to.emit(activity, 'RewardChanged')
                .withArgs('Name', BigNumber.from(1), BigNumber.from(20));
        });

        it('Should revert when changing reward to zero', async () => {
            await expect(activity.setReward(0)).to.be.revertedWith('Reward must be greater than 0');
        });

        it('Should revert when changing reward to current value', async () => {
            await expect(activity.setReward(1)).to.be.revertedWith('Reward must be different');
        });
    });

    describe('set name', async () => {
        let activity: Activity;

        beforeEach(async () => {
            const [wallet] = await ethers.getSigners();
            const factory = await ethers.getContractFactory<Activity__factory>('Activity', wallet);
            activity = await factory.deploy('Name', BigNumber.from(1));
        })

        it('Should change name', async () => {
            await activity.setName('NewName');
            const name = await activity.name();

            expect(name).to.equal('NewName');
        });

        it('Should emit event after changing name', async () => {
            await expect(activity.setName('NewName')).to.emit(activity, 'NameChanged')
                .withArgs('Name', 'NewName');
        });

        it('Should revert when changing name to empty', async () => {
            await expect(activity.setName('')).to.be.revertedWith('Name must be non-empty');
        });
    });
});