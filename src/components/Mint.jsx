import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";

import UNCRAgent from "../UNCRAgent.json";
import MintBG1 from "../assets/MintSubBG.svg";
import "./Mint.scss";
import { useNavigate } from "react-router-dom";
import MintModal from "./MintModal";
import { ethers } from "ethers";
const Mint = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [contract, setContract] = useState();
  const handleWalletConnet = async () => {
    // const provider = await detectEthereumProvider();
    // if (provider) {
    //   console.log("ethereum wallet is connected");
    //   window.web3 = new Web3(provider);
    //   if (window.web3) {
    //     const account = await window.web3.eth.requestAccounts();
    //     console.log(account);
    //   }
    // } else {
    //   window.alert("connect metamask");
    //   console.log("no ethereum wallet detected");
    // }
    // const accounts = await window.web3.eth.getAccounts();
    // setWalletAddress(accounts[0]);
    // const netWorkId = await window.web3.eth.net.getId();
    // console.log(netWorkId);
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log("button");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869",
          UNCRAgent.abi,
          provider
        );
        console.log(contract.address);
        console.log(signer.provider.provider.selectedAddress.slice(0, 10));
        const name = await contract.name();
        console.log(name);
        setWalletAddress(signer.provider.provider.selectedAddress);
        // const data = await contract.balanceOf(
        //   signer.provider.provider.selectedAddress
        // );
        // console.log(data.toString());
      }
    } catch (error) {
      console.log(error);
      if (error.code === "CALL_EXCEPTION" || error.code === "NETWORK_ERROR") {
        window.alert("Please change to Goerli testnet on your metamask.");
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "UNCR_CBT_Sepolia",
              rpcUrls: [
                "https://sepolia.infura.io/v3/3ebf9ab81238402fb50d3dba748fd948",
              ] /* ... */,
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "SPETH",
                decimals: 18,
              },
            },
          ],
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          "0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869",
          UNCRAgent.abi,
          provider
        );
        console.log(contract.address);
        console.log(signer.provider.provider.selectedAddress.slice(0, 10));
        const name = await contract.name();
        console.log(name);
        setWalletAddress(signer.provider.provider.selectedAddress);
      }
    }
  };

  const handleMint = async () => {
    if (walletAddress !== "") {
      // const netWorkId = await window.web3.eth.net.getId();
      // console.log(netWorkId);
      // const abi = UNCRAgent.abi;
      // const address = "0x5BF471e55474fe1bcc0ACE26f65FB13278156b32";
      // const contract = new window.web3.eth.Contract(abi, address);
      // setContract(contract);
      // const totalSupply = await contract.methods
      //   .balanceOf(walletAddress)
      //   .call();
      // console.log(totalSupply);
      // // const AgentID = await contract.methods
      // //   .tokenOfOwnerByIndex(walletAddress, totalSupply - 1)
      // //   .call();
      // // console.log(AgentID);
      // setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const result = await signer.getBalance();
      console.log(result.toString());
      if (result.toString() === "0") {
        window.alert(
          "You need a few goerli ethereum for gas fee. Please get the goerli faucet to goerlifauce.com"
        );
        return;
      }
      const contract = new ethers.Contract(
        "0xee001aC0A6Ac57ddB6442dEf4aA6CE9f92D05869",
        UNCRAgent.abi,
        signer
      );
      try {
        setIsLoading(true);
        const transaction = await contract.accountCreation(1, {
          from: walletAddress,
        });
        await transaction.wait().then(() => {
          setIsLoading(false);
          navigate("/agent", {});
        });
        // await contract.methods
        //   .accountCreation(1)
        //   .send({ from: walletAddress })
        //   .on("receipt", (receipt) => {
        //     console.log(receipt);
        //   })
        //   .on("confirmation", (confNumber) => {
        //     setIsLoading(false);
        //     console.log(confNumber);
        //   })
        //   .then(() => {
        //     navigate("/agent", {});
        //   });
      } catch (error) {
        if (error.code === "UNSUPPORTED_OPERATION") {
          window.alert(
            "You might change the wallet connection on Metamask. Please make sure the connection to tab the wallet address button"
          );
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      window.alert("Please connect metamask");
    }
  };
  useEffect(() => {
    handleWalletConnet();
  }, []);
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
