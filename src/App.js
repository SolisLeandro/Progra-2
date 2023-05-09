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
  const [processes, setProcesses] = useState(0)
  const [simTime, setSimTime] = useState("0s")
  const [ramKb, setRamKb] = useState(0)
  const [ramPercentage, setRamPercentage] = useState("0%")
  const [vRamKb, setVRamKb] = useState(0)
  const [vRamPercentage, setVRamPercentage] = useState("0%")
  const [pagesLoaded, setPagesLoaded] = useState(0)
  const [pagesUnloaded, setPagesUnloaded] = useState(0)
  const [thrashingTime, setThrashingTime] = useState("0s")
  const [thrashingPercentage, setThrashingPercentage] = useState("0%")
  const [fragmentation, setFragmentation] = useState("0KB")
  const [MMU_Simulation, setMMU_Simulation] = useState(null)

  function updateInfo(mmu) {
    var newMemoryTable = []
    var ramKb = 0
    var vRamKb = 0
    var fragmentationKb = 0
    var pagesLoadedd = 0
    var pagesUnloadedd = 0

    var pointerMap = mmu.pointerMap

    mmu.memoryMap?.forEach((value, key) => {
      var PID = key
      var pointers = value

      pointers?.forEach((pointer) => {
        var pages = pointerMap.get(pointer)
        pages?.forEach((page) => {
          if(page.location == "real"){
            ramKb += page.size
            pagesLoadedd++
          } else {
            vRamKb += page.size
            pagesUnloadedd++
          }

          fragmentationKb += page.size - page.usedSize

          newMemoryTable.push({pageId: page.id, pid: PID, pointer:pointer, loaded: page.location == "real" ? "X" : "", physicalAddress: page.physicalAddress})
        })
      })
    })

    var thrashingTimee = mmu.stopwatch.trashingTime
    var totalTime = thrashingTimee + mmu.stopwatch.time

    setRamKb(ramKb/1024)
    setRamPercentage((100 * (ramKb/1024) / 400) + "%")
    setVRamKb(vRamKb/1024)
    setVRamPercentage((100 * (vRamKb/1024) / 400) + "%")
    setFragmentation((fragmentationKb/1024).toFixed(2)+"KB")
    setThrashingTime(thrashingTimee + "s")
    setThrashingPercentage((100 * thrashingTimee / totalTime) + "%")
    setSimTime(totalTime + "s")
    setMemoryTable(newMemoryTable)
    setProcesses(mmu.memoryMap.size)
    setPagesLoaded(pagesLoadedd)
    setPagesUnloaded(pagesUnloadedd)
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
          <PagesThrashingTable pagesLoaded={pagesLoaded} pagesUnloaded={pagesUnloaded} thrashingTime={thrashingTime} thrashingPercentage={thrashingPercentage} fragmentation={fragmentation} />
        </div>
        <div className='memory-table-inner-container'>
          <MemoryTable memoryCells={memoryTable} title={memoryTitle} />
          <ProcessesTimeTable processes={processes} simTime={simTime} />
          <RamTable ramKb={ramKb} ramPercentage={ramPercentage} vRamKb={vRamKb} vRamPercentage={vRamPercentage} />
          <PagesThrashingTable pagesLoaded={pagesLoaded} pagesUnloaded={pagesUnloaded} thrashingTime={thrashingTime} thrashingPercentage={thrashingPercentage} fragmentation={fragmentation} />
        </div>
      </div>
    </div>
  )
}

export default App;