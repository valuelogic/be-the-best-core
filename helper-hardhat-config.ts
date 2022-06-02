export interface networkConfigItem {
  blockConfirmation?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  hardhat: {},
  localhost: {},
  mumbai: {
    blockConfirmation: 6,
  },
};

export const developmentChains = ["hardhat", "loclahost"];
