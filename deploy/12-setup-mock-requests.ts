import { ethers } from 'hardhat';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChains } from '../helper-hardhat-config';
import {Activities, Requests, RequestsManager} from '../typechain-types';

const setupMockRequests: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const { network } = hre;

    const signers = await ethers.getSigners()

    if (developmentChains.includes(network.name)) {
        const requests: Requests = await ethers.getContract('Requests');
        const requestManager: RequestsManager = await ethers.getContract('RequestsManager');
        const activities: Activities = await ethers.getContract('Activities');

        const createdActivities = await activities.getActivities();

        for (let index = 0; index < createdActivities.length; index++){
            const activity = createdActivities[index];
            if(activity.isActive) {
                await requests.connect(signers[1]).request(activity.contractAddress)
            }
        }

        const pendingRequests = await requests.getRequests(0)
        for (let index = 0; index < pendingRequests.length; index++){
            await requestManager.review(index, 1);
        }
    }
};

export default setupMockRequests;
setupMockRequests.tags = ['all', 'setupMockRequests'];
