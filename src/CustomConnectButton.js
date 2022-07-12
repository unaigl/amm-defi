import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const CustomConnectButton = (props) => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              //   style: {
              //     opacity: 0,
              //     pointerEvents: "none",
              //     userSelect: "none",
              //   },
            })}
          >
            {(() => {
              console.log(account);
              if (account /* || account === undefined */) {
                setTimeout(() => {
                  props.setIsConnectedAccount(true);
                }, 500);
              }
              if (!mounted || !account || !chain) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                      // style={{
                      //   background: chain.iconBackground,
                      //   width: 12,
                      //   height: 12,
                      //   borderRadius: 999,
                      //   overflow: "hidden",
                      //   marginRight: 4,
                      // }}
                      >
                        {chain.iconUrl && (
                          <img
                            // alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            // style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
