import { deployMockContract } from "@ethereum-waffle/mock-contract";
import { expect, use } from "chai";
import {
  deployContract,
  MockContract,
  MockProvider,
  solidity,
} from "ethereum-waffle";
import {
  Activities,
  Activities__factory,
  Activity__factory,
  Users__factory,
} from "../typechain-types";

use(solidity);

describe("Activities contract", () => {
  let [admin, normalUser] = new MockProvider().getWallets();
  let usersContract: MockContract;
  let activitiesContract: Activities;

  beforeEach(async () => {
    usersContract = await deployMockContract(admin, Users__factory.abi);
    await usersContract.mock.ensureIsAdmin
      .withArgs(normalUser.address)
      .revertsWithReason("Users__NotAnAdmin");
    await usersContract.mock.ensureIsAdmin.withArgs(admin.address).returns();
    activitiesContract = (await deployContract(admin, Activities__factory, [
      usersContract.address,
    ])) as Activities;
  });

  describe("Deploy", () => {
    it("Should deploy the contract", async () => {
      expect(activitiesContract.address).to.not.be.undefined;
    });
  });

  describe("Add activity", async () => {
    let activity: MockContract;
    const name = "Create a presentation";
    const reward = 100;
    const active = true;

    beforeEach(async () => {
      activity = await deployMockContract(admin, Activity__factory.abi);
    });

    it("Should emit ActivityCreated event", async () => {
      await expect(
        activitiesContract.createActivity(name, reward, active)
      ).to.emit(activitiesContract, "ActivityCreated");
    });

    it("Should revert when not an admin", async () => {
      await expect(
        activitiesContract
          .connect(normalUser)
          .createActivity(name, reward, active)
      ).to.be.revertedWith("Users__NotAnAdmin");
    });
  });

  describe("Get activities", () => {
    it("Should return an empty array", async () => {
      const activities = await activitiesContract.getActivities();
      expect(activities.length).to.equal(0);
    });

    it("Should return an array with one activity", async () => {
      const activity1 = await deployMockContract(admin, Activity__factory.abi);
      const activity2 = await deployMockContract(admin, Activity__factory.abi);
      await activitiesContract.createActivity("First", 100, true);
      await activitiesContract.createActivity("Second", 50, true);

      const activities = await activitiesContract.getActivities();

      expect(activities.length).to.equal(2);
    });
  });
});
