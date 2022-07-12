import React from "react";
import { Manual } from "./manual/Manual.js";
import UniWidget from "./widget/UniWidget.js";

import { MetaMaskProvider } from "metamask-react";

const App = () => {
  return (
    <div className="conatiner">
      <div className="row">
        {/* <div className="md-6">
          <Manual />
        </div> */}
        <div className="md-6">
          <MetaMaskProvider>
            <UniWidget />
          </MetaMaskProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
