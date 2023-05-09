import './Ram.css'

function Ram({memory, title}) {
    return (
      <div className='memory-general-div'>
        <h3 className='memory-h3'>{"RAM - " + title}</h3>
        <div className='memory-div'>
          { memory?.map((element, key) => {
            return (
                <div key={key} style={element.color ? {background: element.color} : {}} className="memory-cell"></div>
            )
          })}
        </div>
      </div>
    )
  }
  
  export default Ram;
  