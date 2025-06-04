import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const DEVNET_ERC20ForSPL_FACTORY = "0xF6b17787154C418d5773Ea22Afc87A95CAA3e957";

  // const ERC20ForSplMintableContract = await ethers.getContractFactory("ERC20ForSplMintable");

  // await deploy("ERC20ForSplMintable", {
  //   from: deployer,
  //   log: true,
  //   autoMine: true,
  // });

  // await deploy("OutputToken", {
  //   from: deployer,
  //   log: true,
  //   autoMine: true,
  // });

  // const outputToken = await hre.ethers.getContract<Contract>("OutputToken", deployer);
  // console.log("👋 OutputToken deployed to:", outputToken.target);

  await deploy("SimpleAbra", {
    from: deployer,
    // Contract constructor arguments
    args: ["0x512E48836Cd42F3eB6f50CEd9ffD81E0a7F15103"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const simpleAbra = await hre.ethers.getContract<Contract>("SimpleAbra", deployer);
  console.log("👋 SimpleAbra deployed to:", simpleAbra.target);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["SimpleAbra"];
