import React from 'react'
import BubbleUser from '../components/Bubble/BubbleUser'
import BubbleAI from '../components/Bubble/BubbleAI'

const Conversation = ({messages}) => {
    
  // console.log(messages, 'From Conversation');

  const messagesRender = messages.map((message,index) =>{
      return (
        <main key= { index }>
         <BubbleUser message = { message.query }/>
         <BubbleAI  message={ message.response }/> 
        </main>
       )
  });
  return (
    <div style={{padding: '8px',}}>
    { messagesRender }
  </div>
  )
}

export default Conversation