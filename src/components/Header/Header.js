import React, { useState } from "react"
import MMU_Simulation from "../../MMU_Simulation/MMU_Simulation"

import './Header.css'

function Header({setMMU_Simulation}) {
  const [selectedFile, setSelectedFile] = useState("")
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  } 

  async function handleFileRead() {
    const reader = new FileReader();
    reader.onload = (event) => {
      return event.target.result   
    };
    reader.readAsText(selectedFile);
  }

  const startBtnClick = async () => {
    var MMU = document.getElementById("mmuSelect").value
    var process = parseInt(document.getElementById("processNum").value)
    var operations = parseInt(document.getElementById("operationsNum").value)
    var seed = document.getElementById("seed").value
    var sleep = document.getElementById("sleep").value
    console.log("MMU: ", MMU)
    console.log("Process: ", process)
    console.log("Operations: ", operations)
    console.log("Seed: ", seed)
    console.log("Sleep: ", sleep)

    var mmuSimulation = new MMU_Simulation(MMU, seed, sleep)
    mmuSimulation.setGenerateRandomInstructions(process, operations)
    
    if(selectedFile != "") {
      await handleFileRead()
    } else {
      console.log("hola")
    }


  }

    return (
      <div className='header-general-div'>
        <div className='header-div'>
          <p>Semilla (Random)</p>
          <input id="seed" />
        </div>

        <div className='header-div'>
          <p>Sleep</p>
          <input id="sleep" className="header-number-input" />
        </div>

        <div className='header-div'>
          <p>Numero de procesos</p>
          <input id="processNum" className="header-number-input" />
        </div>

        <div className='header-div'>
          <p>Cantidad de operaciones</p>
          <input id="operationsNum" className="header-number-input" />
        </div>

        <div className='header-div'>
          <p>Algoritmo a simular</p>
          <select id="mmuSelect">
            <option>FIFO</option>
            <option>SC</option>
            <option>MRU</option>
            <option>RND</option>
          </select>
        </div>

        <div className='header-div'>
          <p>Archivo (Procesos)</p>
          <input type="file" onChange={handleFileSelect} />
        </div>
        <button onClick={startBtnClick}>Iniciar</button>
      </div>
    )
  }
  
  export default Header;
  