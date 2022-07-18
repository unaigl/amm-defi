import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GearFill } from "react-bootstrap-icons";
import axios from "axios";

// import ConnectButton from "./components/ConnectButton";
import ConfigModal from "./swapComponents/ConfigModal";
import CurrencyField from "./swapComponents/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";
import { getContract, getPrice, runSwap } from "./AlphaRouterServiceAdvanced";

// import CustomConnectButton from "./CustomConnectButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Footer from "./Footer/Footer";

// todo: https://wagmi.sh/docs/hooks/useNetwork
import { useNetwork, useSigner } from "wagmi";
import { swapChain, tokenDataInChainX } from "../data/getData";

export function App() {
  // const [provider, setProvider] = useState(undefined);
  // const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(undefined);

  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [token0Contract, settoken0Contract] = useState(undefined);
  const [token1Contract, settoken1Contract] = useState(undefined);
  const [token0Amount, settoken0Amount] = useState(undefined);
  const [token1Amount, settoken1Amount] = useState(undefined);
  const [isConnectedAccount, setIsConnectedAccount] = useState(true);
  const [currentSymbolsList, setcurrentSymbolsList] = useState();
  const [avoidingConflictSymbolsList, setavoidingConflictSymbolsList] =
    useState();
  const [tokenAddresses, setTokenAddresses] = useState();

  const [token0Symbol, setToken0Symbol] = useState("USDT");
  const [token1Symbol, setToken1Symbol] = useState("USDT");

  /*  */
  const { chain } = useNetwork();
  const { signer } = useSigner();

  // todo: default tokens

  // const provider = await new ethers.providers.Web3Provider(window.ethereum);
  // setProvider(provider);
  const gettingTokenAddresses = async () => {};

  // Defining default values: provider, Weth contract and UNI contract
  useEffect(() => {
    // Only when wallet is conected
    if (!chain || !token0Symbol || !token1Symbol) return;
    const { token0, token1 } = gettingTokens();

    console.log({ token0, token1 });

    // const token0Contract = getContract(token0.token.address[0]);
    // settoken0Contract(token0Contract);

    // const token1Contract = getContract(token1.token.address[0]);
    // settoken1Contract(token1Contract);
    // avoidSymbolin0();
  }, [token0Symbol, token1Symbol]);

  useEffect(() => {
    if (!chain) return;

    let chainIds = [1, 137, 3];
    // setCurrentChain(chain);
    let _chainId = parseInt(chain.id);
    for (let i = 0; i < chainIds.length; i++) {
      if (_chainId === chainIds[i]) {
        const { _tokenAddresses, _tokenSymbols } = swapChain(_chainId);
        setTokenAddresses(_tokenAddresses);
        setcurrentSymbolsList(_tokenSymbols);
        setavoidingConflictSymbolsList(_tokenSymbols);

        if (_chainId === 3) {
          setToken0Symbol("WETH");
          setToken1Symbol("USD");
        } else {
          setToken0Symbol("USDT");
          setToken1Symbol("UNI");
        }
      }
    }
  }, [chain]);

  // // Setting signer address
  // const getSigner = async (provider) => {
  //   provider.send("eth_requestAccounts", []);
  //   const signer = provider.getSigner();
  //   setSigner(signer);
  // };
  const isConnected = () => chain !== undefined;
  // Getting user's balance in both tokens
  const getWalletAddress = () => {
    signer.getAddress().then((address) => {
      setSignerAddress(address);
      console.log("token0Contract", token0Contract);
      token0Contract.balanceOf(address).then((res) => {
        settoken0Amount(Number(ethers.utils.formatEther(res)));
      });
      token1Contract.balanceOf(address).then((res) => {
        settoken1Amount(Number(ethers.utils.formatEther(res)));
        console.log("BAAAAALANCE", token1Amount);
      });
    });
  };

  if (signer !== undefined) {
    getWalletAddress();
  }

  const tokenSelectionChanged = (_field, _value) => {
    if (_field === "input") {
      setToken0Symbol(_value);
      if (token0Symbol === token1Symbol) {
        avoidSymbolin1();
      }
    } else {
      setToken1Symbol(_value);
      if (token0Symbol === token1Symbol) {
        console.log("saaaaaaaaaaame");
        avoidSymbolin0();
      }
    }
  };

  // funcion para crear un nuevo array sin el symbolo ya seleccionado en el input o output
  const avoidSymbolin1 = () => {
    let newArr = currentSymbolsList.filter((item) => item !== token0Symbol);
    setavoidingConflictSymbolsList(newArr);
  };
  const avoidSymbolin0 = () => {
    let newArr = avoidingConflictSymbolsList.filter(
      (item) => item !== token1Symbol
    );
    setcurrentSymbolsList(newArr);
  };

  const gettingTokens = () => {
    const token0 = tokenDataInChainX(token0Symbol, chain.id);
    const token1 = tokenDataInChainX(token1Symbol, chain.id);

    return { token0, token1 };
  };

  // Calculating swap ratio
  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    const { token0, token1 } = gettingTokens();
    getPrice(
      chain,
      token0.token,
      token1.token,
      inputAmount,
      slippageAmount,
      Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
      signerAddress
    ).then((data) => {
      setTransaction(data[0]);
      setOutputAmount(data[1]);
      setRatio(data[2]);
      setLoading(false);
    });
  };

  // connectButton + swapContainer
  return (
    <div className="App">
      <div className="appNav">
        <div className="centertNav">
          <div className="connectButtonContainer">
            <ConnectButton id="connect-button" />
          </div>
        </div>
      </div>

      <div className="appBody">
        <p>Choose a BlockChain to operate using uniswap V3 router </p>
        <p>Swap tokens in real Chains. Only for advanced users</p>
        <b>Disclaimer: This DEX works as uniswap's does. Be careful!</b>
        <br />
        <br />
        <div className="swapContainer">
          <div className="swapHeader">
            <span className="swapText">Swap</span>
            <span className="gearContainer" onClick={() => setShowModal(true)}>
              <GearFill />
            </span>
            {showModal && (
              <ConfigModal
                onClose={() => setShowModal(false)}
                setDeadlineMinutes={setDeadlineMinutes}
                deadlineMinutes={deadlineMinutes}
                setSlippageAmount={setSlippageAmount}
                slippageAmount={slippageAmount}
              />
            )}
          </div>

          <div className="swapBody">
            <CurrencyField
              field="input"
              id="input-token"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={token0Amount}
              symbols={currentSymbolsList}
              tokenSelectionChanged={tokenSelectionChanged}
              currentSymbol={token0Symbol}
              // chain={chain}
              // selectedToken={selectedToken}
            />
            <CurrencyField
              field="output"
              id="output-token"
              value={outputAmount}
              signer={signer}
              balance={token1Amount}
              spinner={BeatLoader}
              loading={loading}
              symbols={avoidingConflictSymbolsList}
              tokenSelectionChanged={tokenSelectionChanged}
              currentSymbol={token1Symbol}
              // chain={chain}
            />
          </div>

          <div className="ratioContainer">
            {ratio && <>{`1 UNI = ${ratio} WETH`}</>}
          </div>

          <div className="swapButtonContainer">
            {isConnected() ? (
              <div
                onClick={() => runSwap(transaction, signer)}
                className="swapButton"
              >
                Swap
              </div>
            ) : (
              <div className="swapButton">--</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      {/*  */}
    </div>
  );
}
