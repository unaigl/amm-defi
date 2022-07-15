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

// TODO
const chainId = 1;

const web3Provider = new ethers.providers.JsonRpcProvider(
  REACT_APP_INFURA_URL_TESTNET
);
// TODO
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

// TODO
const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
// const address0 = "0xc778417e063141139fce010982780140aa0cd5ab";
const address0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
// WETH MAIN ETH - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
// WETH ROPSTEN - 0xc778417e063141139fce010982780140aa0cd5ab
// PAXG 0x45804880de22913dafe09f4980848ece6ecbaf78
// WMATIC POLYGON - 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
// WMATIC Mumbai - 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889

const name1 = "Uniswap Token";
const symbol1 = "UNI";
const decimals1 = 18;
// const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";
// UNI MAIN ETH - 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984
// UNI ROPSTEN - 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984
// UNI POLYGON - 0xb33eaad8d922b1083446dc23f610c2567fb5180f

const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
const UNI = new Token(chainId, address1, decimals1, symbol1, name1);

export const getWethContract = () =>
  new ethers.Contract(address0, ERC20ABI, web3Provider);
export const getUniContract = () =>
  new ethers.Contract(address1, ERC20ABI, web3Provider);

export const getPrice = async (
  inputAmount,
  slippageAmount,
  deadline,
  walletAddress
) => {
  const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0);
  const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

  const route = await router.route(currencyAmount, UNI, TradeType.EXACT_INPUT, {
    recipient: walletAddress,
    slippageTolerance: percentSlippage,
    deadline: deadline,
  });

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
  const contract0 = getWethContract();
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  signer.sendTransaction(transaction);
};
