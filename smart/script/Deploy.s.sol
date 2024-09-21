// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/PruffOfPuff.sol";
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
        PruffOfPuff pruffOfPuffInstance = new PruffOfPuff();

        // Log the address of the deployed contract
        console.logString(
            string.concat(
                "PruffOfPuff deployed at: ",
                vm.toString(address(pruffOfPuffInstance)) // Convert the instance to its address
            )
        );

        pruffOfPuffInstance.addAdmin(address(0xAe74fE44cc21d7fE604572ed4b898303957Dde83));
        pruffOfPuffInstance.addPruffer(address(0xAe74fE44cc21d7fE604572ed4b898303957Dde83));
        vm.stopBroadcast();

        // Call exportDeployments to save the ABI, etc.
        exportDeployments();
    }

    function test() public {}
}
