import { useEthers } from "@usedapp/core";

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  if (account) {
    return <button className="border-2  border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto" onClick={() => deactivate()}>Disconnect</button>;
  } else {
    return <button className="border-2 border-theme-yellow text-md px-2 rounded-sm bg-theme-gray hover:bg-theme-yellow/20 justify-center text-center inline-flex mx-auto" onClick={() => activateBrowserWallet()}>Connect</button>;
  }
};

export default ConnectButton;
