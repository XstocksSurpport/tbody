// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {ThreeBody} from "../src/ThreeBody.sol";

contract DeployThreeBody is Script {
    function run() external returns (ThreeBody t) {
        vm.startBroadcast();
        t = new ThreeBody();
        console2.log("ThreeBody:", address(t));
        vm.stopBroadcast();
    }
}
