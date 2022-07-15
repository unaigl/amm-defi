import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GearFill } from "react-bootstrap-icons";
import axios from "axios";

// import ConnectButton from "./components/ConnectButton";
import ConfigModal from "./swapComponents/ConfigModal";
import CurrencyField from "./swapComponents/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";
import {
  getWethContract,
  getUniContract,
  getPrice,
  runSwap,
} from "./AlphaRouterService";

// import CustomConnectButton from "./CustomConnectButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Footer from "./Footer/Footer";

export function App() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(undefined);

  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [wethContract, setWethContract] = useState(undefined);
  const [uniContract, setUniContract] = useState(undefined);
  const [wethAmount, setWethAmount] = useState(undefined);
  const [uniAmount, setUniAmount] = useState(undefined);
  const [isConnectedAccount, setIsConnectedAccount] = useState(true);

  // Defining default values: provider, Weth contract and UNI contract
  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      try {
        const res = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        console.log(res.data);
      } catch (error) {
        console.log("aaaaaaaaaaaaaaaaa", error);
      }

      const wethContract = getWethContract();
      setWethContract(wethContract);

      const uniContract = getUniContract();
      setUniContract(uniContract);
    };
    onLoad();
  }, []);

  // // Setting signer address
  // const getSigner = async (provider) => {
  //   provider.send("eth_requestAccounts", []);
  //   const signer = provider.getSigner();
  //   setSigner(signer);
  // };
  const isConnected = () => signer !== undefined;
  // Getting user's balance in both tokens
  const getWalletAddress = () => {
    signer.getAddress().then((address) => {
      setSignerAddress(address);

      wethContract.balanceOf(address).then((res) => {
        setWethAmount(Number(ethers.utils.formatEther(res)));
      });
      uniContract.balanceOf(address).then((res) => {
        setUniAmount(Number(ethers.utils.formatEther(res)));
      });
    });
  };

  if (signer !== undefined) {
    getWalletAddress();
  }

  // Calculating swap ratio
  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    getPrice(
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
            <ConnectButton />
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
              tokenName="***WETH"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={wethAmount}
            />
            <CurrencyField
              field="output"
              tokenName="***UNI"
              value={outputAmount}
              signer={signer}
              balance={uniAmount}
              spinner={BeatLoader}
              loading={loading}
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
              <div className="swapButton">Swap</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      {/*  */}
    </div>
  );
}
