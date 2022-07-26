import React from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
    return (
        <>
            <div className="app-connect">
                <div className="connectButtonContainer">
                    <ConnectButton id="connect-button" />
                </div>
            </div>

            <div className="app-header-text">
                <p>Choose a BlockChain to operate using uniswap V3 router </p>
                <b>Disclaimer: This DEX works as uniswap's does. Be careful!</b>
                <p>Uniswap will apply the fee for each pool</p>
                <br />
                <br />
            </div>
        </>
    )
}

export default Header