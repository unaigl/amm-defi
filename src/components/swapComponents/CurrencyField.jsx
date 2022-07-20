import React from 'react'
import Form from 'react-bootstrap/Form';
import "../App.css"

const CurrencyField = props => {
  const getPrice = (value) => {
    props.getSwapPrice(value)
  }

  // first time onChange is triggered is not getting correctly tokens balance
  if (props.chain && !props.balance) {
    const trigg = (() => {

      setTimeout(() => {
        console.log('RECURSIVE')
        props.trigger();
        // if (!props.balance) recursive()
      }, 1000);
    })()
    // recursive()
    const a = trigg
    console.log(a)
    if (props.balance) return
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
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => {
            console.log('EVENTOO', e)
            props.tokenSelectionChanged(props.field, e.target.value)
          }}
          id="form-select"
        >
          {/* Agregar diferenciador, color */}
          {/* {props.symbols && <option value={props.currentSymbol} >{props.currentSymbol}</option>}  */}
          {props.symbols ? props.symbols.map((symbol, index) => {
            String.toString(index)
            return (
              <option name={symbol} value={symbol} key={index}>{symbol}</option>

            )
          })
            :
            <>
              <option value={'none'} >{'--'}</option>
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
            Balance: {props.balance?.toFixed(3)}</span>
        </div>
      </div>
    </div>
  )
}

export default CurrencyField
