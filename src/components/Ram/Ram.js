import './Ram.css'

function Ram({memory}) {
    return (
      <div className='memory-general-div'>
        { memory?.map((element) => {
            return (
                <div style={element.color ? element.color : {}} className="memory-cell"></div>
            )
        })}
      </div>
    )
  }
  
  export default Ram;
  