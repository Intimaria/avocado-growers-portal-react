import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/AvocadoGrowerPortal.json"

export default function App() {


  const [currentAccount, setCurrentAccount] = useState("");
  const [paltas, setPaltas] = useState();

  const getCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const avoPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await avoPortalContract.getTotalAvos();
        console.log("Encontramos un numero de paltitas...", count.toNumber());
        count = await avoPortalContract.getTotalAvos();
        setPaltas(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const contractAddress = "0x3C7ea6b5007c2dde9F0f488d340Ef369bfB3065C"
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  useEffect(() => {
    getCount();
  }, [])

  const grow = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const avoPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await avoPortalContract.getTotalAvos();
        console.log("Encontramos un numero de paltitas...", count.toNumber());

        /*
        * Execute the actual avo from your smart contract
        */
        const avoTxn = await avoPortalContract.grow();
        console.log("Mining...", avoTxn.hash);

        await avoTxn.wait();
        console.log("Mined -- ", avoTxn.hash);

        count = await avoPortalContract.getTotalAvos();
        console.log("Encontramos un numero de paltitas...", count.toNumber());
        setPaltas(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
         Hola! <span role="img" aria-label="avocado">🥑</span><span role="img"  aria-label="plant">🌱</span>
        </div>

        <div className="bio">
        Soy Inti y me gusta crecer paltas. Si tambien te gustaría, conecta tu billetera Ethereum y crece tu propia paltita conmigo!
        </div>

        <div className="count">
          <span role="img" aria-label="plant">🌱 = {paltas}</span>
        </div>

        <button className="growButton" onClick={grow}>
          Crece una paltita  <span role="img" aria-label="plant">🌱</span>
        </button>
        

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="growButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
