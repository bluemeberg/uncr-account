import detectEthereumProvider from "@metamask/detect-provider";
import React, { useState } from "react";
import Web3 from "web3";

import UNCRAgent from "../UNCRAgent.json";
import MintBG1 from "../assets/MintSubBG.svg";
import "./Mint.scss";
import { useNavigate } from "react-router-dom";
import MintModal from "./MintModal";
const Mint = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [contract, setContract] = useState();
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
    setWalletAddress(accounts[0]);
    const netWorkId = await window.web3.eth.net.getId();
    console.log(netWorkId);
  };

  const handleMint = async () => {
    if (walletAddress !== "") {
      const netWorkId = await window.web3.eth.net.getId();
      console.log(netWorkId);
      const abi = UNCRAgent.abi;
      const address = "0x5BF471e55474fe1bcc0ACE26f65FB13278156b32";
      const contract = new window.web3.eth.Contract(abi, address);
      setContract(contract);
      const totalSupply = await contract.methods
        .balanceOf(walletAddress)
        .call();
      console.log(totalSupply);
      const AgentID = await contract.methods
        .tokenOfOwnerByIndex(walletAddress, totalSupply - 1)
        .call();
      console.log(AgentID);
      setIsLoading(true);
      try {
        await contract.methods
          .accountCreation(1)
          .send({ from: walletAddress })
          .on("receipt", (receipt) => {
            console.log(receipt);
          })
          .on("confirmation", (confNumber) => {
            setIsLoading(false);
            console.log(confNumber);
          })
          .then(() => {
            navigate("/agent", {});
          });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      window.alert("Please connect metamask");
    }
  };
  console.log("wallet", walletAddress);
  return (
    <div className="container">
      <div className="wallet">
        <div className="walletConnect" onClick={handleWalletConnet}>
          {walletAddress != ""
            ? walletAddress.slice(0, 10) + "..."
            : "Wallet Connect"}
        </div>
      </div>
      <div className="mint">
        <div className="mintTitle">UNCR</div>
        <div className="mintTitle">Account Center</div>
        <div className="space"></div>
        <div className="mintSubtitle">You can create an account</div>
        <div className="mintSubtitle">by minting the Agent NFT</div>
        <div className="mintSubBG">
          <img src={MintBG1} />
        </div>
        <div className="mintSpace"></div>
        <div className="mintButton" onClick={handleMint}>
          Mint Now
        </div>
        {isLoading && <MintModal></MintModal>}
      </div>
    </div>
  );
};

export default Mint;
