import '../MemoryTable/MemoryTable.css'

function RamTable({ramKb, ramPercentage, vRamKb, vRamPercentage}) {
    return (
      <div className='memory-table-general-div'>
        <table className='memory-table'>
            <thead className='memory-thead'>
                <tr className='memory-tr'> 
                    <th className='memory-th'>RAM KB</th>
                    <th className='memory-th'>RAM %</th>
                    <th className='memory-th'>V-RAM KB</th>
                    <th className='memory-th'>V-RAM %</th>
                </tr>
            </thead>
            <tbody>
                <tr className='memory-tr'>
                    <td className='memory-td'>{ramKb}</td>
                    <td className='memory-td'>{ramPercentage}</td>
                    <td className='memory-td'>{vRamKb}</td>
                    <td className='memory-td'>{vRamPercentage}</td>
                </tr>
            </tbody>
        </table>
      </div>
    )
  }
  
  export default RamTable;