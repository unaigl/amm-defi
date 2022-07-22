import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import "../App.css"

const CurrencyField = props => {

  const [search, setSearch] = useState("");


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
            value={props.value}
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
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: "10px" }}
            // Cuando se selecciona desde el input, tambien se settean los tokens para hacer swap directamente, sin tener que usar el form-select
            onBlur={e => {
              props.setTokenContract(() => {

                const filteredSymbols = filteredCoins(e.target.value.toLowerCase())

                console.log('WHAAAAAAAAT', filteredSymbols[0])
                return filteredSymbols[0]
              })
            }}
          >


          </input>

        </div>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            props.setTokenContract(
              document.getElementsByClassName("form-select")[0].value,
              document.getElementsByClassName("form-select")[1].value
            )
          }}
          // id={props.id}
          className="form-select"
        >
          {props.symbols && <option style={{ background: "blue", color: "white" }} value={props.currentSymbol} >{props.currentSymbol}</option>}
          {props.symbols ? filteredCoins(search.toLowerCase()).map((symbol, index) => {
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
