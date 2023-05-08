import './MemoryTable.css'

function MemoryTable({memoryCells, title}) {
    return (
      <div className='memory-table-general-div'>
        <h3>{"MMU - " + title}</h3>
        <div className='memory-table-div'>
            <table className='memory-table'>
                <thead className='memory-thead'>
                    <tr className='memory-tr'> 
                        <th className='memory-th'>Page ID</th>
                        <th className='memory-th'>PID</th>
                        <th className='memory-th'>Loaded</th>
                        <th className='memory-th'>Physical Address</th>
                    </tr>
                </thead>
                <tbody>
                    {memoryCells?.map((row) => (
                        <tr className='memory-tr' key={row.pageId}>
                            <td className='memory-td'>{row.pageId}</td>
                            <td className='memory-td'>{row.pid}</td>
                            <td className='memory-td'>{row.loaded}</td>
                            <td className='memory-td'>{row.physicalAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    )
  }
  
  export default MemoryTable;
  