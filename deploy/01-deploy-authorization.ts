import {DeployFunction} from "hardhat-deploy/types";
import {developmentChains, networkConfig} from "../helper-hardhat-config";
import verify from "../utils/verify";

const deployAuthorization: DeployFunction = async (hre) => {
    const {deployments: {deploy}, network, getNamedAccounts} = hre;
    const {deployer} = await getNamedAccounts();

    const authorization = await deploy("Authorization", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
    })

    if(!developmentChains.includes(network.name)) {
        await verify(authorization.address, []);
    }
}

export default deployAuthorization;
deployAuthorization.tags = ["all", "authorization"];

