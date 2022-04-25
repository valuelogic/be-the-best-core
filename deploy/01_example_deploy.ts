import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const greeter = await deploy('Greeter', {
        from: deployer,
        args: ["Hello"],
        log: true
    });

    log(`Greeter deployed at address ${greeter.address}`);

    
}

export default deploy;