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
      console.log("MMU: ", document.getElementById("mmuSelect").value)
      console.log("Process: ", parseInt(document.getElementById("processNum").value))
      console.log("Operations: ", parseInt(document.getElementById("operationsNum").value))
      console.log("Seed: ", document.getElementById("seed").value)
      console.log("Sleep: ", document.getElementById("sleep").value)
      
      setMMU_Simulation(new MMU_Simulation(document.getElementById("mmuSelect").value, document.getElementById("seed").value, 1))
      console.log("aaaaaa-"+event.target.result); // Aquí puedes hacer lo que necesites con el contenido del archivo
      
    };
    reader.readAsText(selectedFile);
  }

  const startBtnClick = async () => {
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
  