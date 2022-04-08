import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const greeter = await deploy('Activity', {
        from: deployer,
        args: ["Activity 1", 10],
        log: true
    });

    log(`Activity deployed at address ${greeter.address}`);
}

export default deploy;