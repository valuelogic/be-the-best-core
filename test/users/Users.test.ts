const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Users contract", function () {
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

  it("should add user to users list", async function () {
    const Users = await ethers.getContractFactory("Users");

    const usersContract = await Users.deploy();

    const walletAddress = await ethers.Wallet.createRandom().getAddress();

    const nick = "EXPECTED_NICK";

    await usersContract.addUser(walletAddress, nick, false);

    const usersList = await usersContract.getUsers();

    expect(usersList).to.have.lengthOf(1);

    const user = usersList[0];

    expect(user.wallet).to.equal(walletAddress)
    expect(user.isAdmin).to.be.false
    expect(user.nick).to.equal(nick)
    expect(user.points).to.eql(BigNumber.from(0))
  });
});