import '../MemoryTable/MemoryTable.css'

function ProcessesTimeTable({processes, simTime}) {
    return (
      <div className='memory-table-general-div'>
        <table className='memory-table'>
            <thead className='memory-thead'>
                <tr className='memory-tr'> 
                    <th className='memory-th'>Process</th>
                    <th className='memory-th'>Sim-Time</th>
                </tr>
            </thead>
            <tbody>
                <tr className='memory-tr'>
                    <td className='memory-td'>{processes}</td>
                    <td className='memory-td'>{simTime}</td>
                </tr>
            </tbody>
        </table>
      </div>
    )
  }
  
  export default ProcessesTimeTable;
  