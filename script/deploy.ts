import { ethers, run, network } from "hardhat";

async function main() {
  const counterAddress = await deployReviewNft();
  console.log("/* ========== Deployed Contracts ========== */");
  console.log("");
  console.log("Counter: ", counterAddress);
}

async function deployReviewNft() {
  console.log("Deploying contract...");
  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.deployed();
  console.log("Deployed contract to", counter.address);

  if (
    network.config.chainId === 43113 &&
    process.env.AVALANCH_ETHERSCAN_API_KEY
  ) {
    await counter.deployTransaction.wait(5); // wait 5 block from when reviewNft contract was deployed
    await verify(counter.address, []);
  }

  return counter.address;
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
