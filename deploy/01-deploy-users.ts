import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
const deployUsers: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network, getNamedAccounts } = hre;
  const { deploy} = deployments;
  const { deployer } = await getNamedAccounts();

  const users = await deploy("Users", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
  });

  if (!developmentChains.includes(network.name)) {
    await verify(users.address, []);
  }
};

export default deployUsers;
deployUsers.tags = ["all", "users"];
