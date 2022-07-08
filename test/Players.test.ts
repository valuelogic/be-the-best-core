import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import {Players} from "../typechain-types";

describe("Users contract", async () => {
  let adminWallet: SignerWithAddress,
    userWallet1: SignerWithAddress,
    userWallet2: SignerWithAddress;
  let playersContract: Players;

  const user = (await ethers.getSigners())[1];

  beforeEach(async () => {
    [adminWallet, userWallet1, userWallet2] = await ethers.getSigners();
    await deployments.fixture(["authorization", "players"]);
    playersContract = await ethers.getContract("Players");
  });

  describe("Deploy", () => {
    it("Deploys players contract without error", async () => {
      expect(playersContract).not.to.be.null;
    });
  });

  describe("Players list", () => {
    it("Should add players", async () => {
      const nick = "EXPECTED_NICK";

      await playersContract.addPlayer(userWallet1.address, nick);

      const usersList = await playersContract.getPlayers();

      expect(usersList).to.have.lengthOf(1);

      const user = usersList[0];

      expect(user.walletAddress).to.equal(userWallet1.address);
      expect(user.nick).to.equal(nick);
      expect(user.points).to.equal(0);

      await playersContract.addPlayer(userWallet2.address, "random nick");
      const usersListExtended = await playersContract.getPlayers();
      expect(usersListExtended).to.have.lengthOf(2);
    });

    it("should be reverted when added players wallet address have been already used", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick1");

      await expect(
        playersContract.addPlayer(userWallet1.address, "nick2")
      ).to.be.revertedWith("Players__AccountAlreadyRegistered"); // TODO: Check arguments
    });
  });

  describe("Add points", () => {
    it("Should add points to player", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick");
      const user = await playersContract.getPlayer(userWallet1.address);
      expect(user.points).to.equal(0);

      await playersContract.addPoints(userWallet1.address, 2);
      const userWith2Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith2Points.points).to.equal(2);

      await playersContract.addPoints(userWallet1.address, 3);
      const userWith5Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith5Points.points).to.equal(5);
    });

    it("should be reverted when player not exists", async () => {
      await expect(
        playersContract.addPoints(userWallet1.address, 4)
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: Check arguments
    });

    it("should be reverted when action performed by non admin user", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick1");
      await expect(
          playersContract
          .connect(user)
          .addPoints(userWallet1.address, 2)
      ).to.be.revertedWith("Authorization__MissingRole"); // TODO: check arguments
    });
  });
  
  describe("substract points", () => {
    it("should substract users points", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick");
      const user = await playersContract.getPlayer(userWallet1.address);
      expect(user.points).to.equal(0);

      await playersContract.addPoints(userWallet1.address, 7);
      const userWith2Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith2Points.points).to.equal(7);

      await playersContract.substractPoints(userWallet1.address, 3);
      const userWith5Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith5Points.points).to.equal(4);
    });

    it("should store 0 points when substract more points then user currently has", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick");
      const user = await playersContract.getPlayer(userWallet1.address);
      expect(user.points).to.equal(0);

      await playersContract.addPoints(userWallet1.address, 7);
      const userWith2Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith2Points.points).to.equal(7);

      await playersContract.substractPoints(userWallet1.address, 8);
      const userWith5Points = await playersContract.getPlayer(userWallet1.address);
      expect(userWith5Points.points).to.equal(0);
    });

    it("should be reverted when user not exists", async () => {
      await expect(
        playersContract.substractPoints(userWallet1.address, 4)
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: Check args
    });

    it("should be reverted when action performed by non admin user", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick1");
      await expect(
        playersContract
          .connect(userWallet1)
          .substractPoints(userWallet1.address, 2)
      ).to.be.revertedWith("Authorization__MissingRole"); // TODO: check args
    });
  });

  describe("SetNick", () => {
    it("should change players nick", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick");
      const user = await playersContract.getPlayer(userWallet1.address);
      expect(user.nick).to.equal("nick");

      await playersContract.setNick(userWallet1.address, "new_nick");
      const result = await playersContract.getPlayer(userWallet1.address);
      expect(result.nick).to.equal("new_nick");
    });

    it("should be reverted when player not exists", async () => {
      await expect(
        playersContract.setNick(userWallet1.address, "nick")
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: check arguments
    });

    it("should be reverted when action performed by non admin user", async () => {
      await playersContract.addPlayer(userWallet1.address, "nick1");
      await expect(
        playersContract.connect(userWallet1).setNick(userWallet1.address, "nick")
      ).to.be.revertedWith("Authorization__MissingRole");
    });
  });

  // describe("setAdmin", () => {
  //   it("should change users admin role", async () => {
  //     await playersContract.addUser(userWallet1.address, "nick", false);
  //     const user = await playersContract.getUser(userWallet1.address);
  //     expect(user.isAdmin).to.equal(false);
  //
  //     await playersContract.setAdmin(userWallet1.address, true);
  //     const result = await playersContract.getUser(userWallet1.address);
  //     expect(result.isAdmin).to.equal(true);
  //   });
  //
  //   it.only("should be reverted when user not exists", async () => {
  //     await expect(
  //       playersContract.setAdmin(userWallet1.address, true)
  //     ).to.be.revertedWith("Users__WalletNotExists");
  //   });
  //
  //   it("should be reverted when action performed by non admin user", async () => {
  //     await playersContract.addUser(userWallet1.address, "nick1", false);
  //     await expect(
  //       playersContract.connect(userWallet1).setAdmin(userWallet1.address, true)
  //     ).to.be.revertedWith("Users__NotAnAdmin");
  //   });
  // });
});
