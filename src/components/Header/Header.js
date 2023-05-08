import React, { useState } from "react"
import MMU_Simulation from "../../MMU_Simulation/MMU_Simulation"

import './Header.css'

function Header({setMMU_Simulation}) {
  const [selectedFile, setSelectedFile] = useState("")
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  } 

  const handleFileRead = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log("aaaaaa-"+event.target.result); // Aquí puedes hacer lo que necesites con el contenido del archivo
    };
    reader.readAsText(selectedFile);
  }

  const startBtnClick = () => {
    if(selectedFile != "") {
      handleFileRead()
    } else {
      console.log("hola")
    }
  }

    return (
      <div className='header-general-div'>
        <div className='header-div'>
          <p>Semilla (Random)</p>
          <input/>
        </div>

        <div className='header-div'>
          <p>Numero de procesos</p>
          <input className="header-number-input" />
        </div>

        <div className='header-div'>
          <p>Cantidad de operaciones</p>
          <input className="header-number-input" />
        </div>

        <div className='header-div'>
          <p>Algoritmo a simular</p>
          <select>
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
  