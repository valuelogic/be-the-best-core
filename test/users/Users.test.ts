import {expect} from "chai";
import { Contract } from "ethers";
import {ethers} from "hardhat";
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import UsersToken from "../../artifacts/contracts/users/Users.sol/Users.json";
import { truncate } from "fs/promises";

describe("Users contract", async () => {
  const [adminWallet, userWallet1, userWallet2] = new MockProvider().getWallets();
  let usersContract: Contract;

  beforeEach(async () => {
    usersContract = await deployContract(adminWallet, UsersToken);
  });

  describe("deploy", () => {
    it("deploys users contract without error", async () => {
      expect(usersContract).not.to.be.null
    });

    it("deploys users contract with admin", async () => {
      const usersList = await usersContract.getUsers();

      expect(usersList).to.have.lengthOf(1);

      const adminUser = usersList[0];
      expect(adminUser.walletAddress).to.equal(adminWallet.address)
      expect(adminUser.nick).to.equal('')
      expect(adminUser.points).to.equal(0)
      expect(adminUser.isAdmin).to.be.true
    });
  })

  describe("users list", () => {
    it("should add users", async () => {
      const nick = "EXPECTED_NICK";
      
      await usersContract.addUser(userWallet1.address, nick, false);

      const usersList = await usersContract.getUsers();

      expect(usersList).to.have.lengthOf(2);

      const user = usersList[1];

      expect(user.walletAddress).to.equal(userWallet1.address)
      expect(user.nick).to.equal(nick)
      expect(user.points).to.equal(0)
      expect(user.isAdmin).to.be.false
  
      await usersContract.addUser(userWallet2.address, "random nick", true);
      const usersListExtended = await usersContract.getUsers();
      expect(usersListExtended).to.have.lengthOf(3);
    });

    it("should be reverted when added user wallet address have been already used", async () => {      
      await usersContract.addUser(userWallet1.address, "nick1", false);

      await expect(usersContract.addUser(userWallet1.address, "nick2", false))
          .to.be.revertedWith('Wallet address already exists');
    });
  })

  describe("add points", () => {
    it("should add points to user", async () => {
      await usersContract.addUser(userWallet1.address, "nick", false);
      const user = await usersContract.getUser(userWallet1.address);
      expect(user.points).to.equal(0)

      await usersContract.addPoints(userWallet1.address, 2);
      const userWith2Points = await usersContract.getUser(userWallet1.address);
      expect(userWith2Points.points).to.equal(2)

      await usersContract.addPoints(userWallet1.address, 3);
      const userWith5Points = await usersContract.getUser(userWallet1.address);
      expect(userWith5Points.points).to.equal(5);
    });

    it("should be reverted when points are not positive number", async () => {
      await usersContract.addUser(userWallet1.address, "nick1", false);

      await expect(usersContract.addPoints(userWallet1.address, 0))
          .to.be.revertedWith('Points must be positive number');
    });

    it("should be reverted when user not exists", async () => {
      await expect(usersContract.addPoints(userWallet1.address, 4))
          .to.be.revertedWith('User with passed wallet not exists');
    });

    it("should be reverted when action performed by non admin user", async () => {
      await usersContract.addUser(userWallet1.address, "nick1", false);
      await expect(usersContract.connect(userWallet1).addPoints(userWallet1.address, 2))
          .to.be.revertedWith('msg sender must be admin');
    });
  })

  describe("setNick", () => {
    it('should change users nick', async () => {
      await usersContract.addUser(userWallet1.address, "nick", false);
      const user = await usersContract.getUser(userWallet1.address);
      expect(user.nick).to.equal("nick")

      await usersContract.setNick(userWallet1.address, "new_nick");
      const result = await usersContract.getUser(userWallet1.address);
      expect(result.nick).to.equal("new_nick")
    });

    it("should be reverted when nickname is too long", async () => {
      await expect(usersContract.setNick(adminWallet.address, "nick21characterslong1"))
          .to.be.revertedWith('Nickname cannot have more than 20 bytes.');
    });

    it("should be reverted when user not exists", async () => {
      await expect(usersContract.setNick(userWallet1.address, "nick"))
          .to.be.revertedWith('User with passed wallet not exists');
    });

    it("should be reverted when action performed by non admin user", async () => {
      await usersContract.addUser(userWallet1.address, "nick1", false);
      await expect(usersContract.connect(userWallet1).setNick(userWallet1.address, "nick"))
          .to.be.revertedWith('msg sender must be admin');
    });
  })

  describe("setAdmin", () => {
    it('should change users admin role', async () => {
      await usersContract.addUser(userWallet1.address, "nick", false);
      const user = await usersContract.getUser(userWallet1.address);
      expect(user.isAdmin).to.equal(false)

      await usersContract.setAdmin(userWallet1.address, true);
      const result = await usersContract.getUser(userWallet1.address);
      expect(result.isAdmin).to.equal(true)
    });

    it("should be reverted when user not exists", async () => {
      await expect(usersContract.setAdmin(userWallet1.address, true))
          .to.be.revertedWith('User with passed wallet not exists');
    });

    it("should be reverted when action performed by non admin user", async () => {
      await usersContract.addUser(userWallet1.address, "nick1", false);
      await expect(usersContract.connect(userWallet1).setAdmin(userWallet1.address, true))
          .to.be.revertedWith('msg sender must be admin');
    });
  })
});