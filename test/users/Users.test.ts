import {expect} from "chai";
import {ethers} from "hardhat";

describe("Users contract", function () {
  describe("deploy", () => {
    it("deploys users contract without error", async function () {
      const Users = await ethers.getContractFactory("Users");
  
      const usersContract = await Users.deploy();
  
      expect(usersContract).not.to.be.null
    });
  
    it("deploys users contract with empty users list", async function () {
      const Users = await ethers.getContractFactory("Users");
  
      const usersContract = await Users.deploy();
  
      const result = await usersContract.getUsers();
  
      expect(result).to.eql([]);
    });
  })

  describe("users list", () => {
    it("should add users", async function () {
      const Users = await ethers.getContractFactory("Users");
      const usersContract = await Users.deploy();

      const walletAddress = await ethers.Wallet.createRandom().getAddress();
      const nick = "EXPECTED_NICK";
      
      await usersContract.addUser(walletAddress, nick, false);
      const usersList = await usersContract.getUsers();
  
      expect(usersList).to.have.lengthOf(1);
  
      const user = usersList[0];
  
      expect(user.walletAddress).to.equal(walletAddress)
      expect(user.nick).to.equal(nick)
      expect(user.points).to.equal(0)
      expect(user.isAdmin).to.be.false
  
      await usersContract.addUser(await ethers.Wallet.createRandom().getAddress(), "random nick", true);
      const usersListExtended = await usersContract.getUsers();
      expect(usersListExtended).to.have.lengthOf(2);
    });

    it("should be reverted when added user wallet address have been already used", async function () {
      const Users = await ethers.getContractFactory("Users");
      const usersContract = await Users.deploy();

      const walletAddress = await ethers.Wallet.createRandom().getAddress();
      
      await usersContract.addUser(walletAddress, "nick1", false);

      await expect(usersContract.addUser(walletAddress, "nick2", false))
          .to.be.revertedWith('Wallet address already exists');
    });
  })

  describe("add points", () => {
    it("should add points to user", async () => {
      const Users = await ethers.getContractFactory("Users");
      const usersContract = await Users.deploy();

      const walletAddress = await ethers.Wallet.createRandom().getAddress();
      
      await usersContract.addUser(walletAddress, "nick", false);
      const user = await usersContract.getUser(walletAddress);
      expect(user.points).to.equal(0)

      await usersContract.addPoints(walletAddress, 2);
      const userWith2Points = await usersContract.getUser(walletAddress);
      expect(userWith2Points.points).to.equal(2)

      await usersContract.addPoints(walletAddress, 3);
      const userWith5Points = await usersContract.getUser(walletAddress);
      expect(userWith5Points.points).to.equal(5);
    });

    it("should be reverted when points are not positive number", async function () {
      const Users = await ethers.getContractFactory("Users");
      const usersContract = await Users.deploy();

      const walletAddress = await ethers.Wallet.createRandom().getAddress();
      
      await usersContract.addUser(walletAddress, "nick1", false);

      await expect(usersContract.addPoints(walletAddress, 0))
          .to.be.revertedWith('Points must be positive number');
    });
  })
});