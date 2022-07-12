import { SwapWidget } from "@uniswap/widgets";
import "@uniswap/widgets/fonts.css";
import { useMetaMask } from "metamask-react/lib/use-metamask";
import Header from "./Header";

function getStatusMessage(status, connect, account, chainId) {
  if (status === "initializing")
    return <div>Synchronisation with MetaMask ongoing...</div>;
  if (status === "unavailable") return <div>MetaMask not available :(</div>;
  if (status === "notConnected")
    return <button onClick={connect}>Connect to MetaMask</button>;
  if (status === "connecting") return <div>Connecting...</div>;
  if (status === "connected")
    return (
      <div>
        Connected account {account} on chain ID {chainId}
      </div>
    );
}

const MY_TOKEN_LIST = [
  {
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  {
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
];

function UniWidget() {
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  return (
    <div>
      <div>{getStatusMessage(status, connect, account, chainId)}</div>
      <Header />
      <div className="Uniswap">
        <SwapWidget
          provider={ethereum}
          // jsonRpcEndpoint={jsonRpcEndpoint}
          tokenList={MY_TOKEN_LIST}
          width={360}
          // darkMode={true}
        />
      </div>
    </div>
  );
}

export default UniWidget;
