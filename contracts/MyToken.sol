// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract MyToken is ERC20 {
    address public owner;

    constructor() ERC20('MyToken', 'MTK') {
        owner = msg.sender;
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, 'Not owner');
        _mint(to, amount);
    }
}
