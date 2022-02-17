import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/AvocadoGrowerPortal.json"

export default function App() {


  const [currentAccount, setCurrentAccount] = useState("");
  const [avoCount, setAvoCount] = useState(0);
  const [wish, setWish] = useState("");
  const [allAvos, setAllAvos] = useState([]);
  const contractAddress = "0x4277CF10A9809AA6f42d1F34E31833A535aABBF7"
  const contractABI = abi.abi;


  const handlePalta = event => {
    setWish( event.target.value )
  }
  

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
        setAvoCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }




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
        getCount();
        getAllAvos()
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
  }, [avoCount])

  useEffect(() => {
    getAllAvos();
  }, [allAvos])

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
        const avoTxn = await avoPortalContract.grow(wish);
        console.log("Mining...", avoTxn.hash);

        await avoTxn.wait();
        console.log("Mined -- ", avoTxn.hash);

        count = await avoPortalContract.getTotalAvos();
        console.log("Encontramos un numero de paltitas...", count.toNumber());
        setAvoCount(count.toNumber());
        setWish("")
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}

const getAllAvos = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const avoPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const avos = await avoPortalContract.getAllAvos();

      let avosCleaned = [];
      avos.forEach(avo => {
        avosCleaned.unshift({
          address: avo.grower,
          timestamp: new Date(avo.timestamp * 1000),
          wish: avo.wish
        });
      });


      setAllAvos(avosCleaned);
    } else {
      console.log("Ethereum object doesn't exist!")
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

        {currentAccount ? (
        <div className="count">
          Tus <span role="img" aria-label="plant">🌱</span> son {avoCount}
        </div>)
        :
        (<div className="count">
          Conectate para ver tus <span role="img" aria-label="plant">🌱</span>
        </div>
        )}

        <div className="bio">
          <input className="wish" placeholder="Pedi tu deseo :)" onChange={handlePalta}></input>
          <button className="growButton" onClick={grow}>
            Crece una paltita  <span role="img" aria-label="plant">🌱</span>
          </button>

          {!currentAccount && (
          <button className="growButton" onClick={connectWallet}>
            Conecta tu Billetera
          </button>
        )}
        
        </div>


        
      </div>

      <div className="wishContainer"> 
          <div className="header"> 
            Lista de deseos <span role="img" aria-label="plant">🌱</span> {allAvos.length}
          </div> 
            {allAvos.map((avo, index) => {
              return (
                <div key={index} style={
                  { backgroundColor: "lightGreen", 
                    marginTop: "16px", 
                    padding: "8px",
                    justifyContent: "center",
                    color: "white"}}>
                  <div>Direccion: {avo.address}</div>
                  <div>Hora: { Intl.DateTimeFormat('en-US', {
                                      year: 'numeric', 
                                      month: '2-digit', 
                                      day: '2-digit', 
                                      hour: '2-digit', 
                                      minute: '2-digit', 
                                      second: '2-digit'
                    }).format(avo.timestamp)}
                  </div>
                  <div>Deseo: {avo.wish}</div>
                </div>)
            })}
          </div>
          <div style={{padding: "8px"}}>

          </div>



    </div>
  );
}

