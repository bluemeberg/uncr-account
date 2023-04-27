import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect, useState } from "react";
import Web3 from "web3";

import UNCRAgent from "../UNCRAgent.json";
import MintBG1 from "../assets/MintSubBG.svg";
import "./Mint.scss";
import { useNavigate } from "react-router-dom";
import MintModal from "./MintModal";
import { ethers } from "ethers";
import ModalSS from "./ModalBody";
import MintBody from "./ModalBody";
import FaucetInfo from "./FaucetInfo";
import WalletGuide from "../assets/walletGuide.png";
import WalletGuide2 from "../assets/walletGuide2.png";
import FaucetGuide1 from "../assets/faucetGuide1.png";
import FaucetGuide2 from "../assets/faucetGuide2.png";
import FaucetGuide3 from "../assets/faucetGuide3.png";

const Mint = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFaucet, setIsFaucet] = useState(false);
  const navigate = useNavigate();
  const [isGuide, setIsGuide] = useState(false);
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
    setIsGuide(true);
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
        console.log("contract address", contract.address);
        console.log(signer.provider.provider.chainId);
        if (signer.provider.provider.chainId === "0x5") {
          window.alert(
            "Please change to UNCR sepolia testnet on your metamask."
          );
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
                iconUrls: ["https://deluxe-moonbeam-cb4221.netlify.app/0.png"],
              },
            ],
          });
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        }
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
        window.alert("Please change to UNCR sepolia testnet on your metamask.");
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
              iconUrls: ["https://deluxe-moonbeam-cb4221.netlify.app/0.png"],
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
        setIsFaucet(true);
        // window.alert("You need a few sepolia ethereum for gas fee.");
        // window.alert(
        //   "We go to sepoliafuacet for getting gas fee. And when you sign up to Alchemy, ****This browser don't support google signing."
        // );
        // window.alert(
        //   "And it might take long time when sign up or sign in Alchemy"
        // );
        // window.open("https://sepoliafaucet.com/");
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
        {isFaucet && (
          <MintBody closeModal={() => setIsFaucet(!isFaucet)}>
            <div className="walletGuide">
              <div className="waletGuideTitle">
                <strong>가스비를 위한 Sepolia 토큰이 없습니다!!</strong>
              </div>
              <div className="waletGuideText">
                토큰을 받을 수 있는 SepoliaFaucet 사이트로 가게되면 <br></br>
                1. 먼저 Alchemy 사이트를 로그인 해주세요.{" "}
                <strong>
                  단, 로그인 사이트로 이동 소요 시간이 1분 정도 걸릴 수도
                  있습니다ㅜㅜ
                </strong>
              </div>
              <img width="100%" src={FaucetGuide1} />
              <div className="waletGuideText2">
                2. 계정이 없을 시 sign up을 해주세요. <br></br>
                <strong>
                  단, 메타마스크 브라우저는 Google signing을 지원하지 않습니다.
                  이메일로 해도 금방해요!
                </strong>
              </div>
              <img width="100%" src={FaucetGuide2} />
              <div className="waletGuideText3">
                3. 이제 다시 돌아와서 내 지갑 주소를 입력하고 토큰 받기!.
              </div>
              <img width="100%" src={FaucetGuide3} />
              <div className="walletGuideButton">
                <button
                  onClick={() => window.open("https://sepoliafaucet.com/")}
                >
                  Sepolia Site 이동하기!!
                </button>
              </div>
              <div className="waletGuideText3">END</div>
            </div>{" "}
          </MintBody>
        )}
        {isGuide && (
          <MintBody closeModal={() => setIsGuide(!isGuide)}>
            <div className="walletGuide">
              <div className="waletGuideTitle">
                <strong>지갑 연결 주의 사항!!</strong>
              </div>
              <div className="waletGuideText">
                UNCR APP에 연결된 지갑 주소와 <br></br>매칭되는지 확인해주세요!
              </div>
              <img width="100%" src={WalletGuide} />
              <div className="waletGuideText2">
                UNCR APP 과 연결된 지갑 주소와 다를 경우 <br></br>
                <strong>
                  상단 버튼 클릭 후 앱과 연결된 지갑 주소로 변경 필요합니다!
                </strong>
              </div>
              <img width="100%" src={WalletGuide2} />
            </div>
            {/* <WalletGuide /> */}
          </MintBody>
        )}
      </div>
    </div>
  );
};

export default Mint;
