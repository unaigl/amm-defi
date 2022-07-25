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
  _chainId,
  _token0Object,
  _token1Object,
  _web3Provider
) => {
  let chainId = _chainId;
  //Router
  let router = new AlphaRouter({ chainId: chainId, provider: _web3Provider });
  // token0
  console.log("decimals", _token0Object.decimals, _token1Object.decimals);
  const token0 = new Token(
    _chainId,
    _token0Object.address[0],
    Number.parseInt(_token0Object.decimals[0]),
    _token0Object.symbol,
    _token0Object.symbol
  );
  const token1 = new Token(
    _chainId,
    _token1Object.address[0],
    Number.parseInt(_token1Object.decimals[0]),
    _token1Object.symbol,
    _token1Object.symbol
  );
  console.log("1EERRO AQUI", router, token0, token1);
  return { router, token0, token1 };
};

export const getPrice = async (
  _chainId,
  _token0Contract,
  _token0Object,
  _token1Object,
  // token1Decimal,
  inputAmount,
  slippageAmount,
  deadline,
  walletAddress,
  _web3Provider
) => {
  // Declaring token0 contract to use in runSwap function
  token0Contract = _token0Contract; // todo
  // // if (_token0Object.symbol === _token1Object.symbol)
  // //   return alert("Is not possible to swap the same token");
  const { router, token0, token1 } = getChainI_Router_token0_token1(
    _chainId,
    _token0Object,
    _token1Object,
    _web3Provider
  );
  const percentSlippage = new Percent(slippageAmount, 100);
  const inputAmountWei = ethers.utils.parseUnits(
    inputAmount.toString(),
    Number.parseInt(_token0Object.decimals[0])
  );
  const currencyAmount = CurrencyAmount.fromRawAmount(
    /* WETH */ token0,
    JSBI.BigInt(inputAmountWei)
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
