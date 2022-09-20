import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChains } from '../helper-hardhat-config';
import { Activities } from '../typechain-types';

const setupMockActivities: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { network } = hre;

    if (developmentChains.includes(network.name)) {
        const activities: Activities = await ethers.getContract('Activities');
        await activities.createActivity('Activity 1', 10, true);
        await activities.createActivity('Activity 2', 20, true);
        await activities.createActivity('Activity 3', 30, true);
        await activities.createActivity('Deleted Activity', 40, false);
    }
};

export default setupMockActivities;
setupMockActivities.tags = ['all', 'setupMockActivities'];
