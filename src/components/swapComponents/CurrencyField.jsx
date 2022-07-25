import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import "../App.css"

import { useNetwork, useSigner, useProvider, useAccount } from "wagmi";


const CurrencyField = props => {

  const { chain } = useNetwork();

  const [search, setSearch] = useState("");
  const [contractLoadDelay, setContractLoadDelay] = useState();
  // Second state, cause 1st is not updating
  const [contractLoadDelay2, setContractLoadDelay2] = useState(false);

  useEffect(() => {
    if (chain) {
      setContractLoadDelay(true)
      document.getElementById("field-input").value = ""
    }
  }, [chain])

  const getPrice = (value) => {
    props.getSwapPrice(value)
  }

  const showBalance = () => {
    if (props.balance === undefined) return ''
    else return `Balance : ${props.balance?.toFixed(3)}`
  }

  const filteredCoins = (_check) => {
    // if (props.symbols) {
    if (search) {
      const filteredSymbols = props.symbols.filter((coin) =>
        coin.toLowerCase().includes(_check)
      );
      return filteredSymbols
    }
    return props.symbols
    // }
  }
  // Returning current symbols
  const getCurrentSymbols = () => {
    const _symbol0 = document.getElementsByClassName("form-select")[0].value
    const _symbol1 = document.getElementsByClassName("form-select")[1].value
    return [_symbol0, _symbol1]
  }
  // Checking if same token has been selected (or none)
  const symbolChecking = (symbols) => {
    if (symbols[0] === symbols[1] || !symbols[0] || !symbols[1]) {
      setContractLoadDelay2(true)
      console.log('ContractLoadDelay2', contractLoadDelay2)
      alert("Is not possible to swap the same token")
      return false
    }
  }

  return (
    <div className="row currencyInput">
      <div className="col-md-6 numberContainer">
        {props.loading ? (
          <div className="spinnerContainer">
            <props.spinner />
          </div>
        ) : (
          <input
            className="currencyInputField"
            placeholder="0.0"
            defaultValue={props.defaultValue}
            onBlur={e => (props.field === 'input' && e.target.value >= 0.00000001 ? getPrice(e.target.value) : null)}
          />
        )}
      </div>
      <div className="col-md-6 tokenContainer">
        <div className="row">
          <input
            type="text"
            placeholder="Filter by Symbol"
            className="form-control bg-light text-secondary border-0 mt-4 text-center"
            autoFocus
            field={props.field}
            id='field-input'
            onChange={(e) => {
              if (contractLoadDelay) setContractLoadDelay(false)
              setSearch(e.target.value)
            }}
            style={{ marginBottom: "10px" }}
            // Cuando se selecciona desde el input, tambien se settean los tokens para hacer swap directamente, sin tener que usar el form-select
            // todo usando el metodo como esta + agregando el dato del otro form-select (con document? se puede?')
            onBlur={e => {
              if (contractLoadDelay) setContractLoadDelay(false)
              if (search) {
                let filteredSymbols;
                let filtering = () => {
                  // using element's value after filtering from "search" value (in onChange) to get Symbol correctly
                  const filteredSy = filteredCoins(e.target.value.toLowerCase())
                  // taking first value from array (most accurate value)
                  filteredSymbols = filteredSy[0]
                  return filteredSymbols
                }


                // Definfining parameters order for each "currencyField"
                if (!filteredSymbols) return
                // Returning current symbols
                const symbols = getCurrentSymbols()
                // Checking if same token has been selected (or none)
                if (!symbolChecking(symbols)) return console.log('Select different tokens')

                if (e.target.field === 'input') {
                  props.setTokenContract(filtering(), symbols[1])

                } else {
                  props.setTokenContract(symbols[0], filtering())

                }
              }
            }}
          >


          </input>

        </div>
        <Form.Select
          aria-label="Default select example"
          onChange={() => {
            // Returning current symbols
            const symbols = getCurrentSymbols()
            // Checking if same token has been selected (or none)
            if (!symbolChecking(symbols)) return console.log('Select different tokens')

            props.setTokenContract(
              symbols[0], // document.getElementsByClassName("form-select")[0].value,
              symbols[1]// document.getElementsByClassName("form-select")[1].value
            )
            if (contractLoadDelay) setContractLoadDelay(false)

          }}
          // id={props.id}
          className="form-select"
        >
          {(contractLoadDelay || contractLoadDelay2) && <option value={props.symbol}>--</option>} {/* Forcing user to select a token to set selected contracts */}
          {props.symbols ? filteredCoins(search.toLowerCase()).map((symbol, index) => { // USING "filteredCoins" to return only a list of coins that match the search
            String.toString(index)
            return (
              <option name={symbol} value={symbol} key={index}>{symbol}</option>

            )
          })
            :
            <>
              <option value={'--'} >{'--'}</option>
            </>
          }

        </Form.Select>
        <div className="balanceContainer">
          <span
            className="balanceAmount"
            style={{
              right: "100px",
              position: "relative",
            }}>
            {showBalance()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyField
