import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import {Players} from "../typechain-types";

describe("Players contract", async () => {
  let adminWallet: SignerWithAddress,
    playerWallet1: SignerWithAddress,
    playerWallet2: SignerWithAddress;
  let playersContract: Players;

  const player = (await ethers.getSigners())[1];

  beforeEach(async () => {
    [adminWallet, playerWallet1, playerWallet2] = await ethers.getSigners();
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

      await playersContract.addPlayer(playerWallet1.address, nick);

      const playersList = await playersContract.getPlayers();

      expect(playersList).to.have.lengthOf(1);

      const player = playersList[0];

      expect(player.walletAddress).to.equal(playerWallet1.address);
      expect(player.nick).to.equal(nick);
      expect(player.points).to.equal(0);

      await playersContract.addPlayer(playerWallet2.address, "random nick");
      const playersListExtended = await playersContract.getPlayers();
      expect(playersListExtended).to.have.lengthOf(2);
    });

    it("should be reverted when added players wallet address have been already used", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick1");

      await expect(
        playersContract.addPlayer(playerWallet1.address, "nick2")
      ).to.be.revertedWith("Players__AccountAlreadyRegistered"); // TODO: Check arguments
    });
  });

  describe("Add points", () => {
    it("Should add points to player", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick");
      const player = await playersContract.getPlayer(playerWallet1.address);
      expect(player.points).to.equal(0);

      await playersContract.addPoints(playerWallet1.address, 2);
      const playerWith2Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith2Points.points).to.equal(2);

      await playersContract.addPoints(playerWallet1.address, 3);
      const playerWith5Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith5Points.points).to.equal(5);
    });

    it("should be reverted when player not exists", async () => {
      await expect(
        playersContract.addPoints(playerWallet1.address, 4)
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: Check arguments
    });

    it("should be reverted when action performed by non admin player", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick1");
      await expect(
          playersContract
          .connect(player)
          .addPoints(playerWallet1.address, 2)
      ).to.be.revertedWith("Protected__MissingRole"); // TODO: check arguments
    });
  });
  
  describe("substract points", () => {
    it("should substract players points", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick");
      const player = await playersContract.getPlayer(playerWallet1.address);
      expect(player.points).to.equal(0);

      await playersContract.addPoints(playerWallet1.address, 7);
      const playerWith2Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith2Points.points).to.equal(7);

      await playersContract.substractPoints(playerWallet1.address, 3);
      const playerWith5Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith5Points.points).to.equal(4);
    });

    it("should store 0 points when substract more points then player currently has", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick");
      const player = await playersContract.getPlayer(playerWallet1.address);
      expect(player.points).to.equal(0);

      await playersContract.addPoints(playerWallet1.address, 7);
      const playerWith2Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith2Points.points).to.equal(7);

      await playersContract.substractPoints(playerWallet1.address, 8);
      const playerWith5Points = await playersContract.getPlayer(playerWallet1.address);
      expect(playerWith5Points.points).to.equal(0);
    });

    it("should be reverted when player not exists", async () => {
      await expect(
        playersContract.substractPoints(playerWallet1.address, 4)
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: Check args
    });

    it("should be reverted when action performed by non admin player", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick1");
      await expect(
        playersContract
          .connect(playerWallet1)
          .substractPoints(playerWallet1.address, 2)
      ).to.be.revertedWith("Protected__MissingRole"); // TODO: check args
    });
  });

  describe("SetNick", () => {
    it("should change players nick when triggered by admin", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick");
      const player = await playersContract.getPlayer(playerWallet1.address);
      expect(player.nick).to.equal("nick");

      await playersContract.setNick(playerWallet1.address, "new_nick");
      const result = await playersContract.getPlayer(playerWallet1.address);
      expect(result.nick).to.equal("new_nick");
    });

    it("should change players nick when triggered by player himself", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick");
      const player = await playersContract.getPlayer(playerWallet1.address);
      expect(player.nick).to.equal("nick");

      await playersContract.connect(playerWallet1).setNick(playerWallet1.address, "new_nick");
      const result = await playersContract.getPlayer(playerWallet1.address);
      expect(result.nick).to.equal("new_nick");
    });

    it("should be reverted when player not exists", async () => {
      await expect(
        playersContract.setNick(playerWallet1.address, "nick")
      ).to.be.revertedWith("Players__AccountNotRegistered"); // TODO: check arguments
    });

    it("should be reverted when action performed by non admin account and not a player himself", async () => {
      await playersContract.addPlayer(playerWallet1.address, "nick1");
      await expect(
        playersContract.connect(playerWallet2).setNick(playerWallet1.address, "nick")
      ).to.be.revertedWith("Players__UnauthorizedChangeAttempt");
    });
  });
});
