import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";
import {Authorization} from "../typechain-types";
import {ethers} from "hardhat";
import {PLAYER_MANAGER} from "../utils/roles";
const deployPlayersManager: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments: { deploy, get }, network, getNamedAccounts } = hre;
    const { deployer } = await getNamedAccounts();

    const playersContract = await get('Players');
    const authorizationContract = await get('Authorization');
    const args = [authorizationContract.address, playersContract.address];

    const playersManager = await deploy("PlayersManager", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
    });

    const authorization: Authorization = await ethers.getContract("Authorization");
    const tx = await authorization.grantRole(PLAYER_MANAGER, playersManager.address);
    await tx.wait(1);

    if (!developmentChains.includes(network.name)) {
        await verify(playersManager.address, args);
    }
};

export default deployPlayersManager;
deployPlayersManager.tags = ["all", "playersManager"];
