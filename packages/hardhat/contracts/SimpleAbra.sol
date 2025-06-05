// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20ForSPLFactory {
    function createErc20ForSplMintable(
        string memory name,
        string memory symbol,
        uint8 decimals,
        address mint_authority
    ) external returns (address);
}

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

interface IERC20ForSPL {
    function mint(address to, uint256 amount) external;
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract SimpleAbra {
    IERC20 public collateralToken;        // e.g., USDC
    IERC20ForSPL public outputToken;      // 4ap token with mint/burn capability
    address public owner;

    mapping(address => uint256) public collateralBalance;
    mapping(address => uint256) public debt;

    uint256 public collateralFactor = 50; // 50% LTV (Loan to Value)

    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event TokensBorrowed(address indexed user, uint256 amount);
    event TokensRepaid(address indexed user, uint256 amount);

    constructor(
        address _collateralToken,
        address _factory, // ERC20ForSPL factory address
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) {
        collateralToken = IERC20(_collateralToken);
        owner = msg.sender;
        
        // Create a new ERC20ForSPL-Mintable token using the factory
        address tokenAddress = IERC20ForSPLFactory(_factory).createErc20ForSplMintable(
            _name,
            _symbol,
            _decimals,
            address(this) // This contract will be the mint authority
        );
        outputToken = IERC20ForSPL(tokenAddress);
    }

    // Deposit USDC to the contract
    function depositCollateral(uint256 amount) external {
        require(amount > 0, "amount = 0");
        // Note: User must approve this contract to spend their collateral tokens first
        collateralToken.transferFrom(msg.sender, address(this), amount);
        collateralBalance[msg.sender] += amount;
        emit CollateralDeposited(msg.sender, amount);
    }

    // Borrow 4ap (mint new tokens)
    function borrow(uint256 outputTokenAmount) external {
        uint256 maxBorrow = (collateralBalance[msg.sender] * collateralFactor) / 100;
        require(outputTokenAmount <= maxBorrow, "Exceeds max borrow limit");

        debt[msg.sender] += outputTokenAmount;
        outputToken.mint(msg.sender, outputTokenAmount);
        emit TokensBorrowed(msg.sender, outputTokenAmount);
    }

    // Repay 4ap (collect tokens in contract)
    function repay(uint256 outputTokenAmount) external {
        require(outputTokenAmount > 0 && debt[msg.sender] >= outputTokenAmount, "Invalid repayment");
        // Note: User must approve this contract to spend their output tokens first
        outputToken.transferFrom(msg.sender, address(this), outputTokenAmount);
        debt[msg.sender] -= outputTokenAmount;
        emit TokensRepaid(msg.sender, outputTokenAmount);
    }

    // Withdraw USDC from the contract
    function withdrawCollateral(uint256 amount) external {
        require(collateralBalance[msg.sender] >= amount, "Not enough collateral");

        // Recalculate max borrow after withdrawal
        uint256 remainingCollateral = collateralBalance[msg.sender] - amount;
        uint256 maxDebt = (remainingCollateral * collateralFactor) / 100;
        require(debt[msg.sender] <= maxDebt, "Too much debt");

        collateralBalance[msg.sender] -= amount;
        collateralToken.transfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function checkCollateralAllowance(address user) external view returns (uint256) {
        return collateralToken.allowance(user, address(this));
    }

    function checkOutputTokenAllowance(address user) external view returns (uint256) {
        return outputToken.allowance(user, address(this));
    }
}
