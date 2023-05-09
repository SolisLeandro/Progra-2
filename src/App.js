import React, { useState, useEffect} from "react"

import Header from './components/Header/Header' 
import Ram from './components/Ram/Ram' 
import createMemory from './functions/createMemory'
import MemoryTable from "./components/MemoryTable/MemoryTable"
import ProcessesTimeTable from "./components/ProcessesTimeTable/ProcessesTimeTable"
import RamTable from "./components/RamTable/RamTable"
import PagesThrashingTable from "./components/PagesThrashingTable/PagesThrashingTable"
import MMU_Simulation from "./MMU_Simulation/MMU_Simulation"
import colorsArray from "./constants/colors"

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

  const [memory2, setMemory2] = useState(createMemory())
  const [memoryTable2, setMemoryTable2] = useState([])
  const [memoryTitle2, setMemoryTitle2] = useState("")
  const [processes2, setProcesses2] = useState(0)
  const [simTime2, setSimTime2] = useState("0s")
  const [ramKb2, setRamKb2] = useState(0)
  const [ramPercentage2, setRamPercentage2] = useState("0%")
  const [vRamKb2, setVRamKb2] = useState(0)
  const [vRamPercentage2, setVRamPercentage2] = useState("0%")
  const [pagesLoaded2, setPagesLoaded2] = useState(0)
  const [pagesUnloaded2, setPagesUnloaded2] = useState(0)
  const [thrashingTime2, setThrashingTime2] = useState("0s")
  const [thrashingPercentage2, setThrashingPercentage2] = useState("0%")
  const [fragmentation2, setFragmentation2] = useState("0KB")
  const [MMU_Simulation2, setMMU_Simulation2] = useState(null)

  var indexNextColor = 0
  var usedColors = []

  function updateInfo(mmu, mmuIndex) {
    var newMemoryTable = []
    var ramPages = createMemory()
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
          
          var color = "" 
          var fcolor = usedColors.find((x) => x.pid == PID)
          if(fcolor){
            color = fcolor.color
          } else {
            color = colorsArray[indexNextColor]
            indexNextColor++
            usedColors.push({pid: PID, color})
          }

          newMemoryTable.push({pageId: page.id, pid: PID, pointer:pointer, loaded: page.location == "real" ? "X" : "", physicalAddress: page.physicalAddress, color})
        })
      })
    })

    var thrashingTimee = mmu.stopwatch.trashingTime
    var totalTime = thrashingTimee + mmu.stopwatch.time

    newMemoryTable.sort((a, b) => a.physicalAddress - b.physicalAddress)
    newMemoryTable?.forEach((elem) => {
      if(elem.loaded == "X"){
        ramPages[elem.physicalAddress] = {color: elem.color}
      }
    })

    if(mmuIndex == 1){
      setRamKb(ramKb/1024)
      setRamPercentage((100 * (ramKb/1024) / 400) + "%")
      setVRamKb(vRamKb/1024)
      setVRamPercentage((100 * (vRamKb/1024) / 400) + "%")
      setFragmentation((fragmentationKb/1024).toFixed(2)+"KB")
      setThrashingTime(thrashingTimee + "s")
      setThrashingPercentage((100 * thrashingTimee / totalTime).toFixed(2) + "%")
      setSimTime(totalTime + "s")
      setMemoryTable(newMemoryTable)
      setProcesses(mmu.memoryMap.size)
      setPagesLoaded(pagesLoadedd)
      setPagesUnloaded(pagesUnloadedd)
      setMemory(ramPages)
    } else {
      setRamKb2(ramKb/1024)
      setRamPercentage2((100 * (ramKb/1024) / 400) + "%")
      setVRamKb2(vRamKb/1024)
      setVRamPercentage2((100 * (vRamKb/1024) / 400) + "%")
      setFragmentation2((fragmentationKb/1024).toFixed(2)+"KB")
      setThrashingTime2(thrashingTimee + "s")
      setThrashingPercentage2((100 * thrashingTimee / totalTime).toFixed(2) + "%")
      setSimTime2(totalTime + "s")
      setMemoryTable2(newMemoryTable)
      setProcesses2(mmu.memoryMap.size)
      setPagesLoaded2(pagesLoadedd)
      setPagesUnloaded2(pagesUnloadedd)
      setMemory2(ramPages)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setMemoryTitle2(document.getElementById("mmuSelect").value)
      setMemory(createMemory())
      setMemory2(createMemory())
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

        updateInfo(optMMU,1)
        updateInfo(otherMMU,2)
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
        <Ram memory={memory2} title={memoryTitle2} />
      </div>
      <div className='memory-table-container'>
        <div className='memory-table-inner-container'>
          <MemoryTable memoryCells={memoryTable} title={"OPT"} />
          <ProcessesTimeTable processes={processes} simTime={simTime} />
          <RamTable ramKb={ramKb} ramPercentage={ramPercentage} vRamKb={vRamKb} vRamPercentage={vRamPercentage} />
          <PagesThrashingTable pagesLoaded={pagesLoaded} pagesUnloaded={pagesUnloaded} thrashingTime={thrashingTime} thrashingPercentage={thrashingPercentage} fragmentation={fragmentation} />
        </div>
        <div className='memory-table-inner-container'>
          <MemoryTable memoryCells={memoryTable2} title={memoryTitle2} />
          <ProcessesTimeTable processes={processes2} simTime={simTime2} />
          <RamTable ramKb={ramKb2} ramPercentage={ramPercentage2} vRamKb={vRamKb2} vRamPercentage={vRamPercentage2} />
          <PagesThrashingTable pagesLoaded={pagesLoaded2} pagesUnloaded={pagesUnloaded2} thrashingTime={thrashingTime2} thrashingPercentage={thrashingPercentage2} fragmentation={fragmentation2} />
        </div>
      </div>
    </div>
  )
}

export default App;