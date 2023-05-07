import React, { useState, useEffect} from "react"

import Header from './components/Header/Header' 
import Ram from './components/Ram/Ram' 
import createMemory from './functions/createMemory';

import './App.css'

function App() {
  const [memory, setMemory] = useState(createMemory())


  return (
    <div>
      <Header />
      <div className='memory-container'>
        <Ram memory={memory} />
        <Ram memory={memory} />
      </div>
    </div>
  )
}

export default App;
