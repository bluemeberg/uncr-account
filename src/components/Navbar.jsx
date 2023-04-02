import detectEthereumProvider from "@metamask/detect-provider";
import React from "react";
import Web3 from "web3";
import UNCRAgent from "../UNCRAgent.json";
const Navbar = () => {
  const handleWalletConnet = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log("ethereum wallet is connected");
      window.web3 = new Web3(provider);
      if (window.web3) {
        const account = await window.web3.eth.requestAccounts();
        console.log(account);
      }
    } else {
      window.alert("connect metamask");
      console.log("no ethereum wallet detected");
    }
    const accounts = await window.web3.eth.getAccounts();
    const netWorkId = await window.web3.eth.net.getId();
    console.log(netWorkId);
    const abi = UNCRAgent.abi;
    const address = "0x5BF471e55474fe1bcc0ACE26f65FB13278156b32";
    const contract = new window.web3.eth.Contract(abi, address);
    const totalSupply = await contract.methods.balanceOf(accounts[0]).call();
    console.log(totalSupply);
    const AgentID = await contract.methods
      .tokenOfOwnerByIndex(accounts[0], 0)
      .call();
    console.log(AgentID);
    contract.methods
      .accountCreation(1)
      .send({ from: accounts[0] })
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .on("confirmation", (confNumber) => {
        console.log(confNumber);
      })
      .then(() => {
        console.log("success");
      });
  };
  return (
    <div className="wallet">
      <div className="walletConnect" onClick={handleWalletConnet}>
        Wallet Connect
      </div>
    </div>
  );
};

export default Navbar;
