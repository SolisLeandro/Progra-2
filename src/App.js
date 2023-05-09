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
  const [memoryTable, setMemoryTable] = useState([])
  const [memoryTitle, setMemoryTitle] = useState("")
  const [processes, setProcesses] = useState("")
  const [simTime, setSimTime] = useState("")
  const [ramKb, setRamKb] = useState("")
  const [ramPercentage, setRamPercentage] = useState("")
  const [vRamKb, setVRamKb] = useState("")
  const [vRamPercentage, setVRamPercentage] = useState("")
  const [MMU_Simulation, setMMU_Simulation] = useState(null)

  function updateInfo(mmu) {
    var newMemoryTable = []

    var keys = mmu.memoryMap.keys()
    var pointerMap = mmu.pointerMap

    mmu.memoryMap.forEach((value, key) => {
      var PID = key
      var pointers = value

      pointers.forEach((pointer) => {
        var pages = pointerMap.get(pointer)
        pages.forEach((page) => {
          newMemoryTable.push({pageId: page.id, pid: PID, pointer:pointer, loaded: page.location == "real" ? "X" : "", physicalAddress: page.physicalAddress})
        })
      })
    })
    
    setMemoryTable(newMemoryTable)
    setProcesses(mmu.memoryMap.size)

  }

  useEffect(() => {
    const fetchData = async () => {
      
      MMU_Simulation.iniciate()
      var instructions = MMU_Simulation.instructions
      var sleepTime = MMU_Simulation.sleepTime

      for (let index = 0; index < instructions.length; index++) {
        const instruction = instructions[index];
        await Promise.all([
          MMU_Simulation.executeInstruction(instruction, 1, sleepTime),
          MMU_Simulation.executeInstruction(instruction, 2, sleepTime)
        ]);

        var optMMU = MMU_Simulation.optMMU
        var otherMMU = MMU_Simulation.otherMMU

        updateInfo(optMMU)
        
        console.log(instruction)
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