import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VotingContract } from "../typechain-types";

const deployVotingContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("VotingContract", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const contract = await hre.ethers.getContract<VotingContract>("VotingContract", deployer);

  console.log("Deployed VotingContract with greeting:", await contract.greeting());
};

export default deployVotingContract;

deployVotingContract.tags = ["VotingContract"];
