import { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { VotingContract } from "../typechain-types";

describe("VotingContract", function () {
  let contract: VotingContract;
  let deployer: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async () => {
    const contractFactory = await ethers.getContractFactory("VotingContract");
    contract = await contractFactory.deploy();
    await contract.waitForDeployment();

    [deployer, user1, user2] = await ethers.getSigners();
  });

  it("should successfully create a poll", async () => {
    const options = ["Option 1", "Option 2"];
    await contract.createPoll("Test Question", options, 3600);

    const poll = await contract.getPollDetails(0);
    expect(poll.question).to.equal("Test Question");
    expect(poll.options).to.deep.equal(options);
    expect(poll.creator).to.equal(deployer.address);
  });

  it("should revert if less than 2 options are provided", async () => {
    await expect(contract.createPoll("Test Question", ["Option 1"], 3600)).to.be.revertedWith(
      "At least two options required",
    );
  });

  it("should allow a user to vote", async () => {
    await contract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);

    await contract.connect(user1).vote(0, 0);
    const hasVoted = await contract.hasUserVoted(0, user1.address);
    expect(hasVoted).to.equal(true);
  });

  it("should prevent duplicate voting", async () => {
    await contract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);

    await contract.connect(user1).vote(0, 0);
    await expect(contract.connect(user1).vote(0, 0)).to.be.revertedWith("You have already voted");
  });

  it("should only allow the creator to end the poll", async () => {
    await contract.createPoll("Test Question", ["Option 1", "Option 2"], 1);

    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    await contract.endPoll(0);
    const poll = await contract.getPollDetails(0);
    expect(poll.isActive).to.equal(false);
  });

  it("should revert if trying to end the poll prematurely", async () => {
    await contract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);
    await expect(contract.endPoll(0)).to.be.revertedWith("Voting is still active");
  });

  it("should return correct poll results", async () => {
    await contract.createPoll("Test Question", ["Option 1", "Option 2"], 3600);
    await contract.connect(user1).vote(0, 0);
    await contract.connect(user2).vote(0, 1);

    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);

    await contract.endPoll(0);

    const results = await contract.getResults(0);
    expect(results.voteCounts[0]).to.equal(1);
    expect(results.voteCounts[1]).to.equal(1);
  });
});
