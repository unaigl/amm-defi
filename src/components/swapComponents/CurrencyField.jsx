import React from 'react'
import Form from 'react-bootstrap/Form';
import "../App.css"

const CurrencyField = props => {
  const getPrice = (value) => {
    props.getSwapPrice(value)
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
        {/* // todo: dropdown
        <span className="tokenName">{props.tokenName}</span> */}
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => { props.tokenSelectionChanged(e.target.value) }}

        >
          {props.symbols && props.symbols.map((symbol, index) => {
            String.toString(index)
            return (
              <option value={index} key={index}>{symbol}</option>

            )
          })}

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
