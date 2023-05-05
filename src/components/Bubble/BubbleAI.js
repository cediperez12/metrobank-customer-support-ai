import React from 'react'
import './index.css';
const Bubble = ({message}) => {
  
  return (
      <div className="chat-bubble-ai">{ message? message : <span>&nbsp;</span>}</div>
  )
}

export default Bubble