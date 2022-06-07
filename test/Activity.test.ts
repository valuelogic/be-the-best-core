import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import {
  deployContract,
  deployMockContract,
  MockContract,
  MockProvider,
  solidity,
} from "ethereum-waffle";
import { BigNumber } from "ethers";
import { deployments, ethers } from "hardhat";
import {
  Activity,
  Activity__factory,
  Users,
  Users__factory,
} from "../typechain-types";
use(solidity);

describe("Activity contract", () => {
  let admin: SignerWithAddress;
  let normalUser: SignerWithAddress;
  let usersContract: Users;
  const { deploy } = deployments;
  beforeEach(async () => {
    [admin, normalUser] = await ethers.getSigners();
    await deployments.fixture(["users", "setupMockUsers"]);
    usersContract = await ethers.getContract("Users");
  });
  describe("Deploy", async () => {
    it("Should revert when deploying contract with empty name", async () => {
      await expect(
        deploy("Activity", {
          from: admin.address,
          args: ["", 10, true, usersContract.address],
        })
      ).to.be.revertedWith("Activity__EmptyName");
    });

    it("Should revert when deploying contract with zero reward", async () => {
      await expect(
        deploy("Activity", {
          from: admin.address,
          args: ["Name", 0, true, usersContract.address],
        })
      ).to.be.revertedWith("Activity__ZeroReward");
    });

    it("Should deploy contract with given name and reward", async () => {
      const activity = await deploy("Activity", {
        from: admin.address,
        args: ["Name", 1, true, usersContract.address],
      });

      const activityContract: Activity = await ethers.getContractAt(
        "Activity",
        activity.address
      );

      const name = await activityContract.s_name();
      const reward = await activityContract.s_reward();

      expect(name).to.equal("Name");
      expect(reward).to.deep.equal(BigNumber.from(1));
    });
  });

  describe("Functionality", async () => {
    let activityContract: Activity;
    beforeEach(async () => {
      const activity = await deploy("Activity", {
        from: admin.address,
        args: ["Name", 1, true, usersContract.address],
      });
      activityContract = await ethers.getContractAt("Activity", activity.address);
    });

    describe("set reward", async () => {
      it("Should change reward", async () => {
        await activityContract.setReward(20);
        const reward = await activityContract.s_reward();

        expect(reward).to.deep.equal(BigNumber.from(20));
      });

      it("Should emit event after changing reward", async () => {
        await expect(activityContract.setReward(20))
          .to.emit(activityContract, "RewardChanged")
          .withArgs(BigNumber.from(1), BigNumber.from(20));
      });

      it("Should revert when changing reward to zero", async () => {
        await expect(activityContract.setReward(0)).to.be.revertedWith(
          "Activity__ZeroReward"
        );
      });

      it("Should revert when not and admin", async () => {
        await expect(
          activityContract.connect(normalUser).setReward(0)
        ).to.be.revertedWith("Users__NotAnAdmin");
      });
    });

    describe("Set name", async () => {
      it("Should change name", async () => {
        await activityContract.setName("NewName");
        const name = await activityContract.s_name();

        expect(name).to.equal("NewName");
      });

      it("Should emit event after changing name", async () => {
        await expect(activityContract.setName("NewName"))
          .to.emit(activityContract, "NameChanged")
          .withArgs("Name", "NewName");
      });

      it("Should revert when changing name to empty", async () => {
        await expect(activityContract.setName("")).to.be.revertedWith(
          "Activity__EmptyName"
        );
      });

      it("Should revert when not and admin", async () => {
        await expect(
          activityContract.connect(normalUser).setName("NewName")
        ).to.be.revertedWith("Users__NotAnAdmin");
      });
    });
  });
});
