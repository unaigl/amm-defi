import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { GearFill } from "react-bootstrap-icons";

import ConfigModal from "./swapComponents/ConfigModal";
import SwapModal from "./swapComponents/SwapModal";
import Button from "react-bootstrap/Button";

import CurrencyField from "./swapComponents/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";
import { getPrice, runSwap } from "./AlphaRouterServiceAdvanced";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Footer from "./Footer/Footer";

// todo: https://wagmi.sh/docs/hooks/useNetwork
import { useNetwork, useSigner, useProvider, useAccount } from "wagmi";
import { swapChain, tokenDataInChainX } from "../data/getData";
import ERC20ABI from "../data/abi.json";

export function App() {
  const [slippageAmount, setSlippageAmount] = useState(2);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showModal, setShowModal] = useState(undefined);

  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [transaction, setTransaction] = useState(undefined);
  const [loading, setLoading] = useState(undefined);
  const [ratio, setRatio] = useState(undefined);
  const [token0Contract, setToken0Contract] = useState(undefined);
  const [token1Contract, setToken1Contract] = useState(undefined);
  const [token0Amount, settoken0Amount] = useState(undefined);
  const [token1Amount, settoken1Amount] = useState(undefined);
  const [token0Object, settoken0Object] = useState(undefined);
  const [token1Object, settoken1Object] = useState(undefined);
  const [currentSymbolsList, setcurrentSymbolsList] = useState();

  const [token0Symbol, setToken0Symbol] = useState(undefined);
  const [token1Symbol, setToken1Symbol] = useState(undefined);

  const [modalShow, setModalShow] = useState(false);
  const [verified, setVerified] = useState(false);

  /*  WAGMI hooks*/
  const { chain } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const web3Provider = useProvider();
  const { address, isDisconnected } = useAccount();

  /*
    Getting tokens symbols DATA in first render 
    &
    updating tokens symbols when chain changes
  */

  useEffect(() => {
    if (chain) {
      settoken0Amount(0);
      settoken1Amount(0);
      setRatio("--");
      setTransaction(undefined);
      let chainIds = [1, 137, 3];
      let _chainId = parseInt(chain.id);
      for (let i = 0; i < chainIds.length; i++) {
        if (_chainId === chainIds[i]) {
          const _tokenSymbols = swapChain(_chainId);
          // setTokenSymbols(_tokenAddresses);
          setcurrentSymbolsList(_tokenSymbols);
          // set "Currency-field" input-output values
          const currencyFieldValues = document.querySelectorAll(
            ".currencyInputField"
          );
          currencyFieldValues.forEach((a) => (a.value = 0));
          // document.querySelector(".spinnerContainer").value = 0;
          // Setting default token for each chain
          if (_chainId === 3) {
            setToken0Symbol("DAI");
            setToken1Symbol("USD");
          } else {
            setToken0Symbol("APE");
            setToken1Symbol("UNI");
          }
        }
      }
    }
  }, [chain]);

  // Reset input values when wallet is disconnected
  useEffect(() => {
    if (address) {
      settoken0Amount(0);
      settoken1Amount(0);
      setRatio("--");
      setTransaction(undefined);
    }
  }, [address]);

  /* 
  "setTokenContract" function is called from "select form" in "CurrencyField" component and
    updates tokens contracts and user balance when new token is seleceted
  */

  // "gettingTokens" and "getContract" functions are using WAGMI hooks which are instantiated only in App compoenent
  // In bigger DApps, is better idea to separate in different components
  const gettingTokens = (_value0, _value1) => {
    // if wallet is not connected (chain does not exist), take current token 0 and token1 values - In initial rendering we've setted default tokens
    // const _token0 = tokenDataInChainX(_value0, chain.id);
    // const _token1 = tokenDataInChainX(_value1, chain.id);
    setVerified(false);
    const _token0 = tokenDataInChainX(_value0, chain.id);
    const _token1 = tokenDataInChainX(_value1, chain.id);
    // Set obligado, para poder obtener los datos del token en la funcion getPrice
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
    // Only when wallet is conected - Avoiding conflict in first render
    if (chain) {
      // Setting tokenSymbol for "form-select" render
      setToken0Symbol(_value0);
      setToken1Symbol(_value1);
      const { _token0, _token1 } = gettingTokens(_value0, _value1);
      // Getting selected token object and setting contracts (to show balance)
      try {
        // Creating token contracts
        const _token0C = getContract(_token0.token.address[0]);
        const _token1C = getContract(_token1.token.address[0]);
        getBalanceOf(_token0C, _token1C);
      } catch (error) {
        console.log("--token0 and token1 are not defined yet--");
      }
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
          settoken0Amount(Number(ethers.utils.formatEther(res)));
        }),
        // token1 balance
        _token1C.balanceOf(address).then((res) => {
          settoken1Amount(Number(ethers.utils.formatEther(res)));
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

  // Interface - connectButton + swapContainer + footer
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
        <b>Disclaimer: This DEX works as uniswap's does. Be careful!</b>
        <p>Uniswap will apply the fee for each pool</p>
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
              field={"input"}
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={token0Amount}
              symbols={currentSymbolsList}
              setTokenContract={setTokenContract}
              chain={chain}
              symbol={token0Symbol}
              name="form-select-input"
            />
            <CurrencyField
              field={"output"}
              defaultValue={outputAmount}
              signer={signer}
              balance={token1Amount}
              spinner={BeatLoader}
              loading={loading}
              symbols={currentSymbolsList}
              setTokenContract={setTokenContract}
              chain={chain}
              symbol={token1Symbol}
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
              <div
                onClick={() => runSwap(transaction, signer, web3Provider)}
                className="swapButton"
              >
                Swap
              </div>
            ) : (
              <div className="swapButton">--</div>
            )}
          </div>
        </div>
        {/*  */}
        <Button variant="secondary" onClick={() => setModalShow(true)}>
          Verify Transaction
        </Button>

        <SwapModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          symbol0={token0Symbol}
          symbol1={token1Symbol}
          cuantity0={token0Amount}
          cuantity1={token1Amount}
          runSwap={runSwap}
          onVerified={() => setVerified(true)}
        />
        {/*  */}
        <Footer />
      </div>
    </div>
  );
}
