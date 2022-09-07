import React from 'react'

const InputCurrency = (props) => {

    // Returning current symbols
    const getCurrentSymbols = () => {
        const _symbol0 = document.getElementsByClassName("form-select-input")[0].value
        const _symbol1 = document.getElementsByClassName("form-select-output")[0].value
        return [_symbol0, _symbol1]
    }
    // Checking if same token has been selected (or none)
    const symbolChecking = (symbols) => {
        if (symbols[0] === symbols[1] || !symbols[0] || !symbols[1]) {
            props.setContractLoadDelay(true)
            alert("Is not possible to swap the same token")
            return false
        }
        else if (props.contractLoadDelay) {
            props.setContractLoadDelay(false)
        }
        return true
    }

    return (
        <input
            type="text"
            placeholder="Filter by Symbol" // TODO: testing
            className="form-control bg-light text-secondary border-0 mt-4 text-center"
            autoFocus
            field={props.field}
            id='field-input'
            onChange={(e) => {
                if (props.contractLoadDelay) props.setContractLoadDelay(false)
                props.setSearch(e.target.value)
            }}
            style={{ marginBottom: "10px" }}
            // Cuando se selecciona desde el input, tambien se settean los tokens para hacer swap directamente, sin tener que usar el form-select
            onBlur={e => {
                if (props.contractLoadDelay) props.setContractLoadDelay(false)
                if (props.search) {

                    // using DOMelement's value after filtering from "search" value (in onChange) to get Symbol correctly
                    const filteredSymbols = props.filteredCoins(e.target.value.toLowerCase())
                    // taking first value from DATA array (most accurate value)
                    const filteredSymbol = filteredSymbols[0]
                    // Stop process if is not a match
                    if (!filteredSymbol) return
                    // Returning current symbols
                    const symbols = getCurrentSymbols()
                    // Checking if same token has been selected (or none)
                    if (!symbolChecking(symbols, e)) {
                        e.currentTarget.value = "--"
                        return console.log('Select different tokens')
                    }

                    // Definfining parameters order for each "currencyField"
                    if (e.target.field === 'input') {
                        props.setTokenContract(filteredSymbol, symbols[1])

                    } else {
                        props.setTokenContract(symbols[0], filteredSymbol)

                    }
                }
            }}
        >
        </input>
    )
}

export default InputCurrency