import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { GearFill } from "react-bootstrap-icons";
import "./App.css";

import ConfigModal from "./bodySwap/ConfigModal";
import SwapModal from "./bodySwap/SwapModal";

import CurrencyField from "./bodySwap/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";
import { getPrice, runSwap } from "./AlphaRouterServiceAdvanced";

import Footer from "./footer/Footer";
import Header from "./header/Header";

import { useAccount, useNetwork, useProvider, useSigner } from "wagmi";
import ERC20ABI from "../data/abi.json";
import { swapChain, tokenDataInChainX } from "../data/getData";

export function App() {
  /* @dev I recomend to separate this logic in some components, in case you're using this repo to develop more funtionaloties  */

  /* UI state */
  const [showModal, setShowModal] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [modalShow, setModalShow] = useState(false);
  const [verified, setVerified] = useState(false);
  const [isTransaction, setIsTransaction] = useState(true);

  /* DEX logic */
  // To select tokens data depending on selected chain
  const [currentSymbolsList, setcurrentSymbolsList] = useState();
  // Selected (and default) token symbol
  const [token0Symbol, setToken0Symbol] = useState(undefined);
  const [token1Symbol, setToken1Symbol] = useState(undefined);
  // Selected tokens user's balances
  const [token0Balance, setToken0Balance] = useState(undefined);
  const [token1Balance, setToken1Balance] = useState(undefined);
  // Filtering and organizing token's data to use in swap logic
  const [token0Object, settoken0Object] = useState(undefined);
  const [token1Object, settoken1Object] = useState(undefined);
  // Is used to approve uniswap v3 swap router
  const [token0Contract, setToken0Contract] = useState(undefined);

  /* Uniswap v3 Router logic */
  // Swap config variables
  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  // obtaining the amount of token1, from "getPrice" function
  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  // Swap object ready to send to chain
  const [transaction, setTransaction] = useState(undefined);
  // Swap ratio
  const [ratio, setRatio] = useState(undefined);

  /*  WAGMI hooks*/
  const { chain } = useNetwork();
  const { data: signer } = useSigner(); // Uses ethers internally
  const web3Provider = useProvider();
  const { address } = useAccount(); // user wallet

  /*
    Getting tokens symbols DATA in first render 
    &
    updating tokens symbols when chain changes
  */

  useEffect(() => {
    // if wallet is not connected (chain does not exist), take current token 0 and token1 values - In initial rendering we've setted default tokens
    if (chain) {
      // Reseting values when chain changes
      setToken0Balance(0);
      setToken1Balance(0);
      setRatio("--");
      setTransaction(undefined);
      setIsTransaction(true);
      setVerified(false);
      // Detecting which chain has been selected
      let chainIds = [1, 137, 3];
      let _chainId = parseInt(chain.id);
      for (let i = 0; i < chainIds.length; i++) {
        if (_chainId === chainIds[i]) {
          // setting tokens from selected chain
          const _tokenSymbols = swapChain(_chainId);
          setcurrentSymbolsList(_tokenSymbols);
          // set "Currency-field" input-output values when chain changes
          const currencyFieldValues = document.querySelectorAll(
            ".currencyInputField"
          );
          currencyFieldValues.forEach((a) => (a.value = 0));
          // Setting default token for each chain
          if (_chainId === 1 || _chainId === 137) {
            setToken0Symbol("APE");
            setToken1Symbol("UNI");
          } else {
            /* other chains */
          }
        }
      }
    }
  }, [chain]);

  // Reset values when wallet is disconnected
  useEffect(() => {
    if (address) {
      setToken0Balance(0);
      setToken1Balance(0);
      setRatio("--");
      setTransaction(undefined);
      setIsTransaction(true);
    }
  }, [address]);

  /* 
  "setTokenContract" function is called from "select form" in "CurrencyField" component and
    updates tokens contracts and user balance when new token is seleceted
  */

  // "gettingTokens" and "getContract" functions are using WAGMI hooks which are instantiated only in App component
  const gettingTokens = (_value0, _value1) => {
    setVerified(false);
    // Filtering and organizing token's data to use in swap logic
    const _token0 = tokenDataInChainX(_value0, chain.id);
    const _token1 = tokenDataInChainX(_value1, chain.id);
    settoken0Object(_token0.token);
    settoken1Object(_token1.token);
    return { _token0, _token1 };
  };

  // Setting token Contract
  const getContract = (_address) => {
    return new ethers.Contract(_address, ERC20ABI, web3Provider);
  };

  // Setting token contract to get balanceOf when wallet connects
  const setTokenContract = (_value0, _value1) => {
    // clearing previous swap values of inputs in "CurrencyField" component
    document.getElementById("swap-value-input").value = 0;
    document.getElementById("swap-value-output").value = 0;
    if (chain) {
      // Setting tokenSymbol to show in "form-select", in "CurrencyField" component
      setToken0Symbol(_value0);
      setToken1Symbol(_value1);
      const { _token0, _token1 } = gettingTokens(_value0, _value1);
      // Getting selected token object and setting contracts (to show balance and approve uniswap)
      // We don't need token "Contract" object to swap tokens, we'll handle it using "Token" object from "@uniswap/sdk-core"
      const _token0C = getContract(_token0.token.address[0]);
      const _token1C = getContract(_token1.token.address[0]);
      getBalanceOf(_token0C, _token1C);
    }
  };

  // Getting user's balance in both tokens
  const getBalanceOf = async (_token0C, _token1C) => {
    if (_token0C === undefined || _token1C === undefined)
      return console.log("Contracts are not defined yet");
    // using Promise to get balanceOf from smart contract - Here we're using RPC calls via Infura/Alchemy/DefaultProvider
    const myPromise = new Promise((resolve) => {
      resolve(
        // token0 balance
        _token0C.balanceOf(address).then((res) => {
          setToken0Balance(Number(ethers.utils.formatEther(res)));
        }),
        // token1 balance
        _token1C.balanceOf(address).then((res) => {
          setToken1Balance(Number(ethers.utils.formatEther(res)));
        })
      );
    });

    myPromise
      .then(() => {
        setToken0Contract(_token0C);
      })
      .catch((err) =>
        console.log(
          "--Issue getting balance. Provider service is not ready yet, Disconnect wallet, reload page and try again--",
          err
        )
      );
  };

  /* 
     Defining transaction objects in "getSwapPrice"
     Clicking in interface button -> call "runSwap" function (declared in AlphaRouterService)
  */
  const getSwapPrice = async (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    try {
      await getPrice(
        chain.id,
        token0Contract.address,
        token0Object,
        token1Object,
        inputAmount,
        slippageAmount,
        Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
        address,
        web3Provider
      ).then((data) => {
        setTransaction(data[0]);
        setIsTransaction(false);
        setOutputAmount(data[1]);
        setRatio(data[2]);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setOutputAmount(0);
      setRatio("--");
      if (!address) alert("Connect your wallet");
      else alert("Change token selection and try again");
      console.log("--Uniswap Router--", error);
    }
  };
  // styling verify-Swap buttons
  const getClassName = () => {
    if (!isTransaction) return "swapButton button-verify-color";
    else return "swapButton button-no-verify-color";
  };

  // Interface - header + swapContainer + footer
  return (
    <div className="App">
      <Header />
      <div className="appBody">
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
              field={"input"}
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={token0Balance}
              symbol={token0Symbol}
              symbols={currentSymbolsList}
              setTokenContract={setTokenContract}
              chain={chain}
              name="form-select-input"
            />
            <CurrencyField
              field={"output"}
              defaultValue={outputAmount}
              signer={signer}
              balance={token1Balance}
              spinner={BeatLoader}
              loading={loading}
              symbol={token1Symbol}
              symbols={currentSymbolsList}
              setTokenContract={setTokenContract}
              chain={chain}
              name="form-select-output"
            />
          </div>

          <div className="ratioContainer">
            {ratio && (
              <p>
                1 <b>{token1Symbol}</b> = {`${ratio} `}
                <b>{token0Symbol}</b>
              </p>
            )}
          </div>

          <div className="swapButtonContainer">
            {verified ? (
              <button
                onClick={() => runSwap(transaction, signer, web3Provider)}
                className="swapButton button-swap-color"
              >
                Swap
              </button>
            ) : (
              <button
                disabled={isTransaction}
                onClick={() => setModalShow(true)}
                className={getClassName()}
              >
                {!isTransaction ? "Verify Transaction" : "--"}
              </button>
            )}
          </div>
        </div>

        <SwapModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          symbol0={token0Symbol}
          symbol1={token1Symbol}
          balance0={inputAmount}
          balance1={outputAmount}
          runSwap={runSwap}
          onVerified={() => setVerified(true)}
        />
        <Footer />
      </div>
    </div>
  );
}
