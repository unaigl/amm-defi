import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { App } from "./components/App";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.ropsten],
  [
    infuraProvider({ infuraId: process.env.REACT_APP_INFURA_ID }),
    alchemyProvider({ infuraId: process.env.REACT_APP_ALCHEMY_ID }),
    //todo cambiar
    // alchemyProvider({ infuraId: process.env.REACT_APP_ALCHEMY_ID_POLYGON }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const Web3Tools = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Tools;
