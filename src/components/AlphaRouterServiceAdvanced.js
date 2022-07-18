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
const REACT_APP_INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;

const web3Provider = new ethers.providers.JsonRpcProvider(
  REACT_APP_INFURA_URL_TESTNET
);

// todo
let chainId = 1;
let token0Contract;
// let router;
const getChainI_Router_token0_token1 = (_chain, _token0, _token1) => {
  chainId = _chain;
  //Router
  let _router = new AlphaRouter({ chainId: chainId, provider: web3Provider });
  // Declaring token0 contract to use in runSwap function
  token0Contract = _token0.address;
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

export const getContract = (_address) =>
  new ethers.Contract(_address, ERC20ABI, web3Provider);
// // todo
// const name0 = "Wrapped Ether";
// const symbol0 = "WETH";
// const decimals0 = 18;
// const address0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// const name1 = "Uniswap Token";
// const symbol1 = "UNI";
// const decimals1 = 18;
// const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

// // todo
// const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
// const UNI = new Token(chainId, address1, decimals1, symbol1, name1);

// // todo
// export const getWethContract = () =>
//   new ethers.Contract(address0, ERC20ABI, web3Provider);
// export const getUniContract = () =>
//   new ethers.Contract(address1, ERC20ABI, web3Provider);

export const getPrice = async (
  _chain,
  _token0,
  _token1,
  inputAmount,
  slippageAmount,
  deadline,
  walletAddress
) => {
  const { router, token0, token1 } = getChainI_Router_token0_token1(
    _chain,
    _token0,
    _token1
  );
  const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), token0.decimals);
  const currencyAmount = CurrencyAmount.fromRawAmount(
    /* WETH */ token0,
    JSBI.BigInt(wei)
  );

  const route = await router.route(
    currencyAmount,
    /* UNI token */ token1,
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

export const runSwap = async (transaction, signer) => {
  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const contract0 = getContract(token0Contract);
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  signer.sendTransaction(transaction);
};
