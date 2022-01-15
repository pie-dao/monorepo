import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import { ethers } from "ethers";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY!

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.10", settings: {} }],
  },
  networks: {
    hardhat: {},
    localhost: {},
  }
};

task('send', 'Sends some ether', async (args, hre) => {
  const [account] = await hre.ethers.getSigners();
  const myAccount = '0x63BCe354DBA7d6270Cb34dAA46B869892AbB3A79';
  await account.sendTransaction({
    to: myAccount,
    value: ethers.utils.parseEther("1.0")
  })
  console.log('Sent 1 Ether to', myAccount);
})

task('mono', 'Deploys the Mono Contract', async (args, hre) => {
  throw new Error('Not Implemented')
})

export default config;