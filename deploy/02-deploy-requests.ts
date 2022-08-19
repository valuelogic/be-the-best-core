import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { developmentChains, networkConfig } from '../helper-hardhat-config';
import verify from '../utils/verify';
const deployRequests: DeployFunction = async (
    hre: HardhatRuntimeEnvironment
) => {
    const {
        deployments: { deploy, get },
        network,
        getNamedAccounts,
    } = hre;
    const { deployer } = await getNamedAccounts();

    const authorizationContract = await get('Authorization');
    const args = [authorizationContract.address];

    const requests = await deploy('Requests', {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.name].blockConfirmation || 0,
    });

    if (!developmentChains.includes(network.name)) {
        await verify(requests.address, args);
    }
};

export default deployRequests;
deployRequests.tags = ['all', 'requests'];
