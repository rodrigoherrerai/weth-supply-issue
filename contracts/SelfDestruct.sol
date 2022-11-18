// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.0;


contract SelfDestruct {
    receive() external payable {
    }

    function destruct(address target) external {
        assembly {
            selfdestruct(target)
        }
    }
}


