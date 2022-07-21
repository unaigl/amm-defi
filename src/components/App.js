import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { GearFill } from "react-bootstrap-icons";
import axios from "axios";

// import ConnectButton from "./components/ConnectButton";
import ConfigModal from "./swapComponents/ConfigModal";
import CurrencyField from "./swapComponents/CurrencyField";

import BeatLoader from "react-spinners/BeatLoader";
import { getPrice, runSwap } from "./AlphaRouterServiceAdvanced";

// import CustomConnectButton from "./CustomConnectButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Footer from "./Footer/Footer";

// todo: https://wagmi.sh/docs/hooks/useNetwork
import { useNetwork, useSigner, useProvider, useAccount } from "wagmi";
import { swapChain, tokenDataInChainX } from "../data/getData";
import ERC20ABI from "../data/abi.json";

export function App() {
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
  // const [avoidingConflictSymbolsList, setavoidingConflictSymbolsList] =
  //   useState();
  // const [tokenAddresses, setTokenAddresses] = useState();

  const [token0Symbol, setToken0Symbol] = useState(undefined);
  const [token1Symbol, setToken1Symbol] = useState(undefined);
  // no se actualiza con los de arriba... creamos otro par
  const [token0Symbol2, setToken0Symbol2] = useState(undefined);
  const [token1Symbol2, setToken1Symbol2] = useState(undefined);

  const [token0, setToken0] = useState(undefined);
  const [token1, setToken1] = useState(undefined);

  const [isResponse, setIsResponse] = useState(true);

  /*  WAGMI hooks*/
  const { chain } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();
  const web3Provider = useProvider();
  const { address, isConnecting, isDisconnected } = useAccount();

  const isConnected = () => chain !== undefined;

  /* 
    Setting default tokens contract and user balance
    &
    updating tokens contract and user balance when new token is seleceted in the select form 
    function "tokenSelectionChanged" will trigger useEffect
  */

  // // const memoizedCallback = useCallback(() => {
  // //   d(address, chain);
  // // }, [address, chain]);

  // // const d = (address, chain) => {
  // //   const a = () => {
  // //     console.log("aaaaaaaaaaaaaaa");
  // //     setToken1(address);
  // //   };
  // //   const b = () => {
  // //     console.log("aaaaaaaaaaaaaaa");
  // //     setToken1(chain);
  // //   };
  // //   a();
  // //   b();
  // // };

  useEffect(() => {
    // // Setting default token when app is loaded
    // setToken0Symbol("USDT");
    // setToken1Symbol("UNI");
    // // Setting default token when app is loaded
    // setToken0(tokenDataInChainX("USDT", 1));
    // setToken1(tokenDataInChainX("UNI", 1));
    // //
    // const _tokenSymbols = swapChain(1);
    // // setTokenSymbols(_tokenAddresses);
    // setcurrentSymbolsList(_tokenSymbols);
    //
    // var element = document.getElementById("form-select");
    // element.addEventListener("change", () => console.log("change"));
    // var event = new Event("change", { bubbles: true });
    // element.dispatchEvent(event);
  }, []);

  // useEffect(() => {
  //   if (chain) {

  //   }
  // }, [chain, token0Symbol, token1Symbol]);

  //   chain, // Objects
  //   token0Symbol,
  //   token1Symbol,
  //   address,
  //   token0Contract,// Objects
  //   token1Contract,// Objects
  //   web3Provider,// Objects
  //   token0,// Objects
  //   token1,// Objects
  //   token0Amount,
  //   token1Amount,

  /*
    Getting tokens symbols DATA in first render 
    &
    updating tokens symbols when chain changes
  */
  useEffect(() => {
    if (chain) {
      let chainIds = [1, 137, 3];
      let _chainId = parseInt(chain.id);
      for (let i = 0; i < chainIds.length; i++) {
        if (_chainId === chainIds[i]) {
          const _tokenSymbols = swapChain(_chainId);
          // setTokenSymbols(_tokenAddresses);
          setcurrentSymbolsList(_tokenSymbols);
          // Setting default token for each chain
          if (_chainId === 3) {
            setToken0Symbol("WETH");
            setToken1Symbol("USD");
          } else {
            setToken0Symbol("USDT");
            setToken1Symbol("UNI");
            console.log("seetted");
          }
          // trigger();
        }
      }
      console.log("CHAAAAAAAAAAAAAAIN");
    }
  }, [chain]);

  // // triggering onchange event from code to get tkens balanceOf
  // const trigger = () => {
  //   // Triggering once chain is created or modifyed. Goal is to define balance of tokens setted by default
  //   // Create an element -> suscribe -> trigger onChange event
  //   var element = document.getElementById("form-select");
  //   element.addEventListener("change", () => console.log("change"));
  //   var event = new Event("change", { bubbles: true });
  //   element.dispatchEvent(event);
  //   // // Remove listner
  //   // setTimeout(() => {
  //   //   if (token0Amount && token1Amount) {
  //   //     element.removeEventListener();
  //   //   }
  //   // }, 2000);
  // };

  /* 
    Setting token when a new token is seleceted in the select form
     todo Setting token LIST when a new token is seleceted in the select form
  */

  const gettingTokens = () => {
    // if wallet is not connected (chain does not exist), take current token 0 and token1 values - In initial rendering we've setted default tokens
    if (chain) {
      console.log("LASST", token0Symbol2, token0Symbol2);
      const _token0 = tokenDataInChainX(token0Symbol2, chain.id);
      const _token1 = tokenDataInChainX(token1Symbol2, chain.id);
      setToken0(_token0);
      setToken1(_token1);
    }
  };

  // Setting token Contract
  const getContract = (_address) => {
    return new ethers.Contract(_address, ERC20ABI, web3Provider);
  };

  // todo comprobaciones

  // Setting token contract to get balanceOf when wallet connects
  const setTokenContract = () => {
    // Getting selected token object and setting contracts (to show balance)
    gettingTokens();

    try {
      const token0Contract = getContract(token0.token.address[0]);
      settoken0Contract(token0Contract);

      const token1Contract = getContract(token1.token.address[0]);
      settoken1Contract(token1Contract);

      console.log("token1Contract", token1Contract);
      console.log({ a: token0.token.symbol, b: token1.token.symbol });
    } catch (error) {
      console.log("--token0 and token1 are not defined yet--", error);
    }

    console.log("token0Contract", token0Contract);
  };

  // Getting user's balance in both tokens
  const getBalanceOf = async () => {
    // // const address = "0x85732427df4874db73600685072d54b99e72c9ca";
    try {
      console.log("CALL USING INFURA");
      // // TODO NO SE SI LA LOGICA siuge creando LOOPS, o si me han cerrado infura ethers.Contract
      // // const a = await token0Contract.balanceOf(address).then((res) => {
      // //   settoken0Amount(Number(ethers.utils.formatEther(res)));
      // //   console.log("BAAAAALANCE", token0, token0Amount);
      // // });
      // // const b = await token1Contract.balanceOf(address).then((res) => {
      // //   settoken1Amount(Number(ethers.utils.formatEther(res)));
      // //   console.log("BAAAAALANCE", token1, token1Amount);
      // // });
      // if (token0Contract === undefined || token1Contract === undefined)
      //   return console.log("JUEVES");
      // const myPromise = new Promise((resolve, reject) => {
      //   resolve(
      //     // token0 balance
      //     token0Contract.balanceOf(address).then((res) => {
      //       settoken0Amount(Number(ethers.utils.formatEther(res)));
      //     }),
      //     // token1 balance
      //     token1Contract.balanceOf(address).then((res) => {
      //       settoken1Amount(Number(ethers.utils.formatEther(res)));
      //     })
      //   );
      // });

      // myPromise
      //   .then(() => {
      //     // if (!token0Amount) setIsResponse(true);
      //     console.log("BAAAAALANCE", token0, token0Amount);
      //     console.log("BAAAAALANCE", token1, token1Amount);
      //   })
      //   .catch((err) => console.log("ERROR --Alchemy ", err));
      // // settoken0Amount(1);
      // // settoken1Amount(1);
    } catch (error) {
      console.log("--Alchemy service is not ready yet, try again--", error);
      // getWalletAddress();
      // settoken0Amount(0);
      // settoken1Amount(0);
      // // console.log("token0Amount", token0Amount);
      // // console.log("token1Amount", token1Amount);
      // setTokenContract();
    }
  };

  const tokenSelectionChanged = (_field, _value) => {
    // TODO separar solicitud de token 0 o 1
    if (_field === "input") {
      let value = _value();
      setToken0Symbol(value);
      setToken0Symbol2(value);
      // token0SymbolVar = value;
    } else {
      let value = _value();
      setToken1Symbol(value);
      setToken1Symbol2(value);
      // token1SymbolVar = value;
    }
    setTokenContract();
    getBalanceOf();
  };
  /* 
    // todo: Trying to delete selected token from the list of 2nd select form
    if (_field === "input") {
      console.log("NOT WORKING", typeof token0Symbol, token0Symbol);
      setToken0Symbol(_value);
      console.log("NOT WORKING", typeof token0Symbol, token0Symbol);
      let newArr = currentSymbolsList.filter((item) => item !== token0Symbol);
      setavoidingConflictSymbolsList(newArr);
    } else {
      setToken1Symbol(_value);
      let newArr = avoidingConflictSymbolsList.filter(
        (item) => item !== token1Symbol
      );
      setcurrentSymbolsList(newArr);
    }
 */

  /* 
     Defining transaction objects in "getSwapPrice"
     Clicking in interface button -> call "runSwap" function (declared in AlphaRouterService)
  */
  // swap ratio
  const getSwapPrice = (inputAmount) => {
    setLoading(true);
    setInputAmount(inputAmount);

    // // const { token0, token1 } = gettingTokens();
    // getPrice(
    //   chain,
    //   token0.token,
    //   token1.token,
    //   inputAmount,
    //   slippageAmount,
    //   Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
    //   signer, // todo: estaba como signerAddress. "signer.address" ?? es lo mismo? o "address" ?
    //   web3Provider
    // ).then((data) => {
    //   setTransaction(data[0]);
    //   setOutputAmount(data[1]);
    //   setRatio(data[2]);
    //   setLoading(false);
    // });
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
        <p>Swap tokens in real Chains. Only for advanced users</p>
        <b>Disclaimer: This DEX works as uniswap's does. Be careful!</b>
        <p>Uniswap will apply the fee of each pool</p>
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
              // id="input-token"
              getSwapPrice={getSwapPrice}
              signer={signer}
              balance={token0Amount}
              symbols={currentSymbolsList}
              tokenSelectionChanged={tokenSelectionChanged}
              currentSymbol={token0Symbol}
              elementId={"form-select-input"}
              // trigger={trigger}
              // chain={chain}
              // isResponse={isResponse}
              // setIsResponse={setIsResponse}
            />
            <CurrencyField
              field="output"
              // id="output-token"
              value={outputAmount}
              signer={signer}
              balance={token1Amount}
              spinner={BeatLoader}
              loading={loading}
              symbols={currentSymbolsList}
              tokenSelectionChanged={tokenSelectionChanged}
              currentSymbol={token1Symbol}
              elementId={"form-select-output"}
              // trigger={trigger}
              // chain={chain}
              // isResponse={isResponse}
              // setIsResponse={setIsResponse}
            />
          </div>

          <div className="ratioContainer">
            {ratio && <>{`1 UNI = ${ratio} WETH`}</>}
          </div>

          <div className="swapButtonContainer">
            {isConnected() ? (
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
        <Footer />
      </div>
      {/*  */}
    </div>
  );
}
