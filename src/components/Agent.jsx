import React, { useEffect, useState } from "react";
import "./Agent.scss";
import MintBG1 from "../assets/MintSubBG.svg";
import UNCRlogo from "../assets/Logo.svg";
import UNCRAgent from "../UNCRAgent.json";
import { useLocation, useRoutes } from "react-router-dom";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
const Agent = () => {
  const [agentID, setAgentID] = useState();
  console.log("agentID", agentID);
  async function getNFTBalance() {
    const provider = await detectEthereumProvider();
    window.web3 = new Web3(provider);
    const account = await window.web3.eth.requestAccounts();
    console.log(account);
    const abi = UNCRAgent.abi;
    const address = "0x5BF471e55474fe1bcc0ACE26f65FB13278156b32";
    const contract = new window.web3.eth.Contract(abi, address);
    const totalSupply = await contract.methods.balanceOf(account[0]).call();
    console.log(totalSupply);
    const AgentID = await contract.methods
      .tokenOfOwnerByIndex(account[0], totalSupply - 1)
      .call();
    console.log(AgentID);
    setAgentID(AgentID);
    return AgentID;
  }
  useEffect(() => {
    const result = getNFTBalance();
  });
  const src = `https://uncr.io/${agentID}.png`;
  return (
    <div className="agentContainer">
      <div className="header">
        <div className="header_logo">
          <img src={UNCRlogo} />
        </div>
      </div>
      <div className="agent">
        <div className="agent_thumbnail">
          <img src={src} />
        </div>
        <div className="agent_number">Welcome Agent #{agentID}</div>
        <div className="agent_disclaimer">
          You have become an agent of UNCR.
        </div>
        <div className="agent_go_back">
          Please go back to the UNCR 1.0,
          <br /> Complete the account creation process.
        </div>
        <div className="agent_close_btn">Close</div>
      </div>
    </div>
  );
};

export default Agent;
