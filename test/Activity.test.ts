import { expect, use } from "chai";
import {
    deployContract,
    deployMockContract,
    MockContract,
    MockProvider,
    solidity
} from "ethereum-waffle";
import { BigNumber } from "ethers";
import {
    Activity, Activity__factory, Users__factory
} from "../typechain-types";
use(solidity);

describe("Activity contract", () => {
  let [admin, normalUser] = new MockProvider().getWallets();
  let usersContract: MockContract;
  let activitiesContract: Activity;

  beforeEach(async () => {
    usersContract = await deployMockContract(admin, Users__factory.abi);
    await usersContract.mock.ensureIsAdmin
      .withArgs(normalUser.address)
      .revertsWithReason("Users__NotAnAdmin");
    await usersContract.mock.ensureIsAdmin.withArgs(admin.address).returns();
  });
  describe("Deploy", async () => {
    it("Should revert when deploying contract with empty name", async () => {
      await expect(
        deployContract(admin, Activity__factory, [
          "",
          10,
          true,
          usersContract.address,
        ])
      ).to.be.revertedWith("Activity__EmptyName");
    });

    it("Should revert when deploying contract with zero reward", async () => {
      await expect(
        deployContract(admin, Activity__factory, [
          "Name",
          0,
          true,
          usersContract.address,
        ])
      ).to.be.revertedWith("Activity_ZeroReward");
    });

    it("Should deploy contract with given name and reward", async () => {
      const activity = (await deployContract(admin, Activity__factory, [
        "Name",
        1,
        true,
        usersContract.address,
      ])) as Activity;

      const name = await activity.s_name();
      const reward = await activity.s_reward();

      expect(name).to.equal("Name");
      expect(reward).to.deep.equal(BigNumber.from(1));
    });
  });

  describe("Functionality", async () => {
    let activity: Activity;
    beforeEach(async () => {
      activity = (await deployContract(admin, Activity__factory, [
        "Name",
        BigNumber.from(1),
        true,
        usersContract.address,
      ])) as Activity;
    });

    describe("set reward", async () => {
      it("Should change reward", async () => {
        await activity.setReward(20);
        const reward = await activity.s_reward();

        expect(reward).to.deep.equal(BigNumber.from(20));
      });

      it("Should emit event after changing reward", async () => {
        await expect(activity.setReward(20))
          .to.emit(activity, "RewardChanged")
          .withArgs(BigNumber.from(1), BigNumber.from(20));
      });

      it("Should revert when changing reward to zero", async () => {
        await expect(activity.setReward(0)).to.be.revertedWith(
          "Activity__ZeroReward"
        );
      });

      it("Should revert when not and admin", async () => {
        await expect(
          activity.connect(normalUser).setReward(0)
        ).to.be.revertedWith("Users__NotAnAdmin");
      });
    });

    describe("Set name", async () => {
      it("Should change name", async () => {
        await activity.setName("NewName");
        const name = await activity.s_name();

        expect(name).to.equal("NewName");
      });

      it("Should emit event after changing name", async () => {
        await expect(activity.setName("NewName"))
          .to.emit(activity, "NameChanged")
          .withArgs("Name", "NewName");
      });

      it("Should revert when changing name to empty", async () => {
        await expect(activity.setName("")).to.be.revertedWith(
          "Activity__EmptyName"
        );
      });

      it("Should revert when not and admin", async () => {
        await expect(
          activity.connect(normalUser).setName("NewName")
        ).to.be.revertedWith("Users__NotAnAdmin");
      });
    });
  });
});
