import React, { useState } from "react"

import './Header.css'

function Header() {
  const [selectedFile, setSelectedFile] = useState("")
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  } 

  const handleFileRead = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log(event.target.result); // Aquí puedes hacer lo que necesites con el contenido del archivo
    };
    reader.readAsText(selectedFile);
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
        <button onClick={handleFileRead}>Iniciar</button>
      </div>
    )
  }
  
  export default Header;
  