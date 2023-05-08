import React, { useState, useEffect} from "react"

import Header from './components/Header/Header' 
import Ram from './components/Ram/Ram' 
import createMemory from './functions/createMemory'
import MemoryTable from "./components/MemoryTable/MemoryTable"
import ProcessesTimeTable from "./components/ProcessesTimeTable/ProcessesTimeTable"
import RamTable from "./components/RamTable/RamTable"
import PagesThrashingTable from "./components/PagesThrashingTable/PagesThrashingTable"
import MMU_Simulation from "./MMU_Simulation/MMU_Simulation"

import './App.css'

function App() {
  const [memory, setMemory] = useState(createMemory())
  const [memoryTable, setMemoryTable] = useState([
    {pageId: 1, pid: 1, loaded: "X", physicalAddress:1},
    {pageId: 2, pid: 1, loaded: "X", physicalAddress:2},
    {pageId: 3, pid: 1, loaded: "X", physicalAddress:3},
    {pageId: 4, pid: 2, loaded: null, physicalAddress:null},
    {pageId: 5, pid: 2, loaded: "X", physicalAddress:4},
  ])
  const [memoryTitle, setMemoryTitle] = useState("")
  const [processes, setProcesses] = useState("")
  const [simTime, setSimTime] = useState("")
  const [ramKb, setRamKb] = useState("")
  const [ramPercentage, setRamPercentage] = useState("")
  const [vRamKb, setVRamKb] = useState("")
  const [vRamPercentage, setVRamPercentage] = useState("")
  const [MMU_Simulation, setMMU_Simulation] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(function() {
        console.log("holita")
      }, 3000)
      
      MMU_Simulation.iniciate()
      var instructions = MMU_Simulation.instructions
      var sleepTime = MMU_Simulation.sleepTime

      for (let index = 0; index < instructions.length; index++) {
        const instruction = instructions[index];
        MMU_Simulation.executeInstruction(instruction, 1, sleepTime)
        MMU_Simulation.executeInstruction(instruction, 2, sleepTime)
      }

      setMMU_Simulation(null)
    }
  
    if (MMU_Simulation) {
      fetchData()
    }

    
  },[MMU_Simulation]);

  return (
    <div>
      <Header MMU={MMU_Simulation} setMMU_Simulation={setMMU_Simulation} />
      <div className='memory-container'>
        <Ram memory={memory} title={"OPT"} />
        <Ram memory={memory} title={memoryTitle} />
      </div>
      <div className='memory-table-container'>
        <div className='memory-table-inner-container'>
          <MemoryTable memoryCells={memoryTable} title={"OPT"} />
          <ProcessesTimeTable processes={processes} simTime={simTime} />
          <RamTable ramKb={ramKb} ramPercentage={ramPercentage} vRamKb={vRamKb} vRamPercentage={vRamPercentage} />
          <PagesThrashingTable />
        </div>
        <div className='memory-table-inner-container'>
          <MemoryTable memoryCells={memoryTable} title={memoryTitle} />
          <ProcessesTimeTable processes={processes} simTime={simTime} />
          <RamTable ramKb={ramKb} ramPercentage={ramPercentage} vRamKb={vRamKb} vRamPercentage={vRamPercentage} />
          <PagesThrashingTable />
        </div>
      </div>
    </div>
  )
}

export default App;

/*

(async function main() {
  for (const instruction of instructions) {
    await Promise.all([
      executeInstruction(instruction, optMMU, sleepTime),
      executeInstruction(instruction, otherMMU, sleepTime),
    ]);
  }

  // Puedes guardar los resultados en un archivo si lo deseas
  // saveInstructionsToFile(instructions, outputFile);
})(); */
