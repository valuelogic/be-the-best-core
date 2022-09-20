import { ethers } from 'hardhat';

export const ADMIN = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('ADMIN'));
export const PLAYER = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('PLAYER')
);
export const PLAYER_MANAGER = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('PLAYER_MANAGER')
);
export const REQUEST_MANAGER = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('REQUEST_MANAGER')
);
