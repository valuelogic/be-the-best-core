import {ethers, getNamedAccounts} from "hardhat";
import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {developmentChains} from "../helper-hardhat-config";
import {PlayersManager} from "../typechain-types";

const setupMockPlayers: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {network, getUnnamedAccounts} = hre;
    const {deployer} = await getNamedAccounts();
    const [player1, player2] = await getUnnamedAccounts();

    if (developmentChains.includes(network.name)) {
        const playersManager: PlayersManager = await ethers.getContract("PlayersManager");
        await playersManager.addPlayer(deployer, "Deployer", true);
        await playersManager.addPlayer(player1, "First", false);
        await playersManager.addPlayer(player2, "Second", false);
    }
};

export default setupMockPlayers;
setupMockPlayers.tags = ["all", "setupMockPlayers"];
