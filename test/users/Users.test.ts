const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

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
  })
});