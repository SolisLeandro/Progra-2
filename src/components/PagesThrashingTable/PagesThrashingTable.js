import '../MemoryTable/MemoryTable.css'

function RamTable({pagesLoaded, pagesUnloaded, thrashingTime, thrashingPercentage, fragmentation}) {
    return (
      <div className='memory-table-general-div'>
        <table className='memory-table'>
            <thead className='memory-thead'>
                <tr className='memory-tr'> 
                    <th className='memory-th'>Pages</th>
                    <th className='memory-th'>Thrashing</th>
                    <th className='memory-th'>Fragmentation</th>
                </tr>
            </thead>
            <tbody>
                <th className='memory-tr-2'>
                    <th className='memory-th-2'>Loaded</th>
                    <th className='memory-th-2'>Unloaded</th>
                    <tr>
                        <td className='memory-td'>{pagesLoaded}</td>
                        <td className='memory-td'>{pagesUnloaded}</td>
                    </tr>
                </th>
                <th className='memory-th-2' style={parseFloat(thrashingPercentage.replace("%","")) > 50 ? {backgroundColor:"red"} : {backgroundColor:"mintcream"}}>
                    <td className='memory-td-2'>{thrashingTime}</td>
                    <td className='memory-td-2'>{thrashingPercentage}</td>
                </th>
                <th className='memory-th-2'>
                    <td className='memory-td-2'>{fragmentation}</td>
                </th>
            </tbody>
        </table>
      </div>
    )
  }
  
  export default RamTable;