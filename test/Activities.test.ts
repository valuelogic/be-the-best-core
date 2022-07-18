import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { deployments, ethers } from "hardhat";
import { Activities } from "../typechain-types";

use(solidity);

describe("Activities contract", () => {
  let activitiesContract: Activities;

  beforeEach(async () => {
    await deployments.fixture("all");
    activitiesContract = await ethers.getContract("Activities");
  });

  describe("Deploy", () => {
    it("Should deploy the contract", async () => {
      expect(activitiesContract.address).to.not.be.undefined;
    });
  });

  describe("Add activity", async () => {
    const name = "Create a presentation";
    const reward = 100;
    const active = true;
    let player: SignerWithAddress;
    beforeEach(async () => {
      [, player] = await ethers.getSigners();
    });
    it("Should emit ActivityCreated event", async () => {
      await expect(
        activitiesContract.createActivity(name, reward, active)
      ).to.emit(activitiesContract, "ActivityCreated");
    });

    it("Should revert when not an admin", async () => {
      await expect(
        activitiesContract
          .connect(player)
          .createActivity(name, reward, active)
      ).to.be.revertedWith("Authorization__MissingRole"); // TODO: Add args to revertedWith?
    });
  });

  describe("Get activities", () => {
    it("Should return an empty array", async () => {
      const activities = await activitiesContract.getActivities();
      expect(activities.length).to.equal(0);
    });

    it("Should return an array with one activity", async () => {
      await activitiesContract.createActivity("First", 100, true);
      await activitiesContract.createActivity("Second", 50, true);

      const activities = await activitiesContract.getActivities();

      expect(activities.length).to.equal(2);
    });
  });
});
