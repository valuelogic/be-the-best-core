import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
const deployRequestsManager: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { deployments: { deploy, get }, network, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const authorizationContract = await get('Authorization');
    const requestsContract = await get('Requests');
    const playersContract = await get('Players');
    const args = [authorizationContract.address, requestsContract.address, playersContract.address];

    const requestsManager = await deploy("RequestsManager", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
    });

    if (!developmentChains.includes(network.name)) {
        await verify(requestsManager.address, args);
    }
};

export default deployRequestsManager;
deployRequestsManager.tags = ["all", "requestsManager"];
