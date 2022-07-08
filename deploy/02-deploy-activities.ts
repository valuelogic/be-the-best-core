import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
const deployActivities: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments, network, getNamedAccounts } = hre;
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();

  const authorization = await get("Authorization");
  const args = [authorization.address];

  const activites = await deploy("Activities", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
  });

  if (!developmentChains.includes(network.name)) {
    await verify(activites.address, args);
  }
};

export default deployActivities;
deployActivities.tags = ["all", "activities"];
