import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/ethers-v5";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.8",
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      chainId: 31337
    },
    mumbai: {
      chainId: 80001,
      url: "https://rpc-mumbai.matic.today"
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  }
}

export default config;