import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
const deployPlayers: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments: { deploy, get }, network, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const authorizationContract = await get('Authorization');
  const args = [authorizationContract.address];

  const users = await deploy("Players", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
  });

  if (!developmentChains.includes(network.name)) {
    await verify(users.address, args);
  }
};

export default deployPlayers;
deployPlayers.tags = ["all", "players"];
