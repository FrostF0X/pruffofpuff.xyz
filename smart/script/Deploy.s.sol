// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/MrrrrrchKL2024.sol";
import "./DeployHelpers.s.sol";


contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }

        vm.startBroadcast(deployerPrivateKey);

        // Declare a variable to hold the contract instance
        MrrrrrchKL2024 i = new MrrrrrchKL2024();

        // Log the address of the deployed contract
        console.logString(
            string.concat(
                "MrrrrrchKL2024 deployed at: ",
                vm.toString(address(i)) // Convert the instance to its address
            )
        );

        i.setServerAddress(address(0xad21E1159CA9e568968E64B47241e7BcF180ae85));
        vm.stopBroadcast();

        // Call exportDeployments to save the ABI, etc.
        exportDeployments();
    }

    function test() public {}
}
