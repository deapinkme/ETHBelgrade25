// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract SimpleAbra {
    IERC20 public collateralToken;        // e.g., yvUSDT
    IERC20 public outputToken;            // 4ap (mock stablecoin)

    mapping(address => uint256) public collateralBalance;
    mapping(address => uint256) public debt;

    uint256 public collateralFactor = 50; // 50% LTV (Loan to Value)

    constructor(address _collateralToken, address _outputToken) {
        collateralToken = IERC20(_collateralToken);
        outputToken = IERC20(_outputToken);
    }

    function depositCollateral(uint256 amount) external {
        require(amount > 0, "amount = 0");
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateralBalance[msg.sender] += amount;
    }

    function borrow(uint256 mimAmount) external {
        uint256 maxBorrow = (collateralBalance[msg.sender] * collateralFactor) / 100;
        require(mimAmount <= maxBorrow, "Exceeds max borrow limit");

        debt[msg.sender] += mimAmount;
        outputToken.transfer(msg.sender, mimAmount);
    }

    function repay(uint256 outputTokenAmount) external {
        require(outputTokenAmount > 0 && debt[msg.sender] >= outputTokenAmount, "Invalid repayment");
        outputToken.transferFrom(msg.sender, address(this), outputTokenAmount);
        debt[msg.sender] -= outputTokenAmount;
    }

    function withdrawCollateral(uint256 amount) external {
        require(collateralBalance[msg.sender] >= amount, "Not enough collateral");

        // Recalculate max borrow after withdrawal
        uint256 remainingCollateral = collateralBalance[msg.sender] - amount;
        uint256 maxDebt = (remainingCollateral * collateralFactor) / 100;
        require(debt[msg.sender] <= maxDebt, "Too much debt");

        collateralBalance[msg.sender] -= amount;
        collateralToken.transfer(msg.sender, amount);
    }
}
