const { AlphaRouter } = require("@uniswap/smart-order-router");
const {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk-core");
const { ethers, BigNumber } = require("ethers");
const JSBI = require("jsbi");
const ERC20ABI = require("../data/abi.json");

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"; // Route02 0xE592427A0AEce92De3Edee1F18E0157C05861564

// Initialized and declared in "getChainI_Router_token0_token1" to use in "runSwap" function
let token0Contract;

const getChainI_Router_token0_token1 = (
  _chain,
  _token0,
  _token1,
  _web3Provider
) => {
  let chainId = _chain;
  //Router
  let _router = new AlphaRouter({ chainId: chainId, provider: _web3Provider });
  // Declaring token0 contract to use in runSwap function
  token0Contract = _token0.address; // todo
  // token0
  const token0 = new Token(
    _chain,
    _token0.address,
    _token0.decimals,
    _token0.symbol,
    _token0.symbol
  );
  const token1 = new Token(
    _chain,
    _token1.address,
    _token1.decimals,
    _token1.symbol,
    _token1.symbol
  );

  return { _router, token0, token1 };
};

export const getPrice = async (
  _chain,
  _token0,
  _token1,
  inputAmount,
  slippageAmount,
  deadline,
  walletAddress,
  _web3Provider
) => {
  if (_token0.symbol === _token1.symbol)
    return alert("Is not possible to swap the same token");
  const { router, token0, token1 } = getChainI_Router_token0_token1(
    _chain,
    _token0,
    _token1,
    _web3Provider
  );
  const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), token0.decimals);
  const currencyAmount = CurrencyAmount.fromRawAmount(
    /* WETH */ token0,
    JSBI.BigInt(wei)
  );

  const route = await router.route(
    currencyAmount,
    /* UNI token */ token1, // todo
    TradeType.EXACT_INPUT,
    {
      recipient: walletAddress,
      slippageTolerance: percentSlippage,
      deadline: deadline,
    }
  );

  const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: walletAddress,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const quoteAmountOut = route.quote.toFixed(6);
  const ratio = (inputAmount / quoteAmountOut).toFixed(3);

  return [transaction, quoteAmountOut, ratio];
};

// Giving approval to spend token0 to uniswap v3 router address in order to execute swap
export const runSwap = async (transaction, signer, web3Provider) => {
  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const contract0 = new ethers.Contract(token0Contract, ERC20ABI, web3Provider);
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  signer.sendTransaction(transaction);
};
