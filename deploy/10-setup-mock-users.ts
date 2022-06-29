import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { Users } from "../typechain-types";
const setupMockUsers: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { network, getUnnamedAccounts } = hre;
  const [user1, user2] = await getUnnamedAccounts();

  if (developmentChains.includes(network.name)) {
    const users: Users = await ethers.getContract("Users");
    users.addUser(user1, "First", false);
    users.addUser(user2, "Second", false);
  }
};

export default setupMockUsers;
setupMockUsers.tags = ["all", "setupMockUsers"];
