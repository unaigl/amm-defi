import "../App.css";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./lib/connector";

function Header() {
  const { chainedId, account, active, activate, deactivate } = useWeb3React();

  const handleConnect = () => {
    if (active) {
      deactivate();
      return;
    }

    activate(injected, (error) => {
      if ("/No Ethereum provider was found on window.ethereum/".test(error)) {
        window.open("https://metamask.io/download.html");
      }
    });
  };

  return (
    <div className="Header">
      Hello World
      <div>
        <p>Account: {account}</p>
        <p>ChainId: {chainedId}</p>
      </div>
      <div>
        <button type="button" onClick={handleConnect}>
          {active ? "disconnect" : "connect"}
        </button>
      </div>
    </div>
  );
}

export default Header;
