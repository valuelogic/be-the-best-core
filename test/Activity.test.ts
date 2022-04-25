import { expect, use } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import Activity from "../build/Activity.json";
import { ActivityFactory } from "../build/typechain-types";

use(solidity);

describe('Activity contract', () => {
    it('Should not deploy contract with empty name', async () => {
        const [wallet] = new MockProvider().getWallets();
        let errorMessage = '';

        try {
            await deployContract(wallet, Activity, ['', 10], {gasLimit: 100000})
        } catch (error: any) {
            errorMessage = (Object.values(error.results)[0] as any)!.reason;
        }
        expect(errorMessage).to.equal('Name must be non-empty');
    });

    it('Should not deploy contract with zero score', async () => {
        const [wallet] = new MockProvider().getWallets();
        let errorMessage = '';

        try {
            await deployContract(wallet, Activity, ['Name', 0], {gasLimit: 100000})
        } catch (error: any) {
            debugger;
            errorMessage = (Object.values(error.results)[0] as any)!.reason;
        }
        expect(errorMessage).to.equal('Reward must be greater than 0');
    });

    it('Should deploy contract with given name and reward', async () => {
        const [wallet] = await ethers.getSigners();
        const factory = new ActivityFactory(wallet);

        const activity = await factory.deploy('Name', BigNumber.from(1));
        const name = await activity.name({gasLimit: 100000});
        const reward = await activity.reward({gasLimit: 100000});

        expect(name).to.equal('Name');
        expect(reward).to.deep.equal(BigNumber.from(1));
    });

    xit('Should emit event after deploying contract', () => {
        // TODO: Check how to verify emitted event after deployment
    });

    it('Should change reward', async () => {
        const [wallet] = await ethers.getSigners();
        const factory = new ActivityFactory(wallet);
        const activity = await factory.deploy('Name', BigNumber.from(1));

        await activity.setReward(20);
        const reward = await activity.reward();

        expect(reward).to.deep.equal(BigNumber.from(20));
    });

    it('Should emit event after changing reward', async () => {
        const [wallet] = await ethers.getSigners();
        const factory = new ActivityFactory(wallet);
        const activity = await factory.deploy('Name', BigNumber.from(1));

        expect(activity.setReward(20)).to.emit(activity, 'RewardChanged')
            .withArgs('Name', BigNumber.from(1), BigNumber.from(20));
    });

    it('Should change name', async () => {
        const [wallet] = await ethers.getSigners();
        const factory = new ActivityFactory(wallet);
        const activity = await factory.deploy('Name', BigNumber.from(1));

        await activity.setName('NewName');
        const name = await activity.name();

        expect(name).to.equal('NewName');
    });

    it('Should emit event after changing name', async () => {
        const [wallet] = await ethers.getSigners();
        const factory = new ActivityFactory(wallet);
        const activity = await factory.deploy('Name', BigNumber.from(1));

        expect(activity.setName('NewName')).to.emit(activity, 'NameChanged')
            .withArgs('Name', 'NewName');
    });
});