const hre = require("hardhat");

async function main() {
  console.log("Deploying Blog contract...");
  
  // Deploy the contract
  const Blog = await hre.ethers.getContractFactory("Blog");
  const blog = await Blog.deploy();
  
  await blog.waitForDeployment();
  
  const address = await blog.getAddress();
  console.log("Blog contract deployed to:", address);

  // For Etherscan verification
  console.log("Waiting for block confirmations...");
  await blog.deploymentTransaction().wait(5);
  
  console.log("Verifying contract on Etherscan...");
  await hre.run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
  
  console.log("Contract verified on Etherscan!");
  return address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
