import {DeployFunction} from "hardhat-deploy/types";
import {ethers} from "hardhat";
import {existsSync, writeFileSync, readFileSync, mkdirSync} from "fs";
import * as fs from "fs";

const CONSTANTS_DIRECTORY = '../be-the-best-front/constants';
const CONTRACT_ADDRESSES_FILE = `${CONSTANTS_DIRECTORY}/addresses.json`;
const CONTRACTS = ['Authorization', 'Activities', 'Players', 'Requests', 'PlayersManager', 'RequestsManager'] as const;

type ContractName = typeof CONTRACTS[number];

interface IContractAddresses {
    [chainId: string]: Record<ContractName, string>;
}

const updateFrontend: DeployFunction = async ({network}) => {
    if (process.env.UPDATE_FRONTEND) {
        console.log('Updating frontend files...');
        const chainId = network.config.chainId!;

        if (!existsSync(CONSTANTS_DIRECTORY)) {
            mkdirSync(CONSTANTS_DIRECTORY);
        }
        await Promise.all([updateAddresses(chainId), updateTypes()]);
    }
}

const updateAddresses = async (chainId: number) => {
    let currentAddresses: IContractAddresses = existsSync(CONTRACT_ADDRESSES_FILE)
        ? JSON.parse(readFileSync(CONTRACT_ADDRESSES_FILE, 'utf-8'))
        : {};

    currentAddresses[chainId] = currentAddresses[chainId] || {};

    for (const contractName of CONTRACTS) {
        console.log(`Updating ${contractName} address...`);
        currentAddresses[chainId][contractName] = (await ethers.getContract(contractName)).address;
    }

    writeFileSync(CONTRACT_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

const updateTypes = async () => {
    fs.cpSync('./typechain-types', `${CONSTANTS_DIRECTORY}/typechain-types`, { recursive: true });
}

export default updateFrontend;
updateFrontend.tags = ['all', 'update-frontend'];