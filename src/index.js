import React from "react";
import ReactDOM from "react-dom/client";
import Web3Tools from "./Web3Tools";
import "bootstrap/dist/css/bootstrap.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="container">
      <div className="row">
        <div
        // className="col-md-6"
        // style={{
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
        >
          <Web3Tools />
        </div>
      </div>
    </div>
  </React.StrictMode>
);
