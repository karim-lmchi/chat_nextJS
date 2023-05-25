import React, { useState, useEffect } from 'react'
import { Context } from '../pages/index';
import styles from '../styles/Message.module.css'
import { FiArrowLeft, FiArrowRightCircle } from "react-icons/fi";

type MessageType = {
  conversationId: number,
}

export const Message = ({ conversationId }: MessageType) => {
  const context = React.useContext(Context)
  const [messages, setMessages] = useState([])
  const [recipientNickname, setRecipientNickname] = useState('')
  const [senderNickname, setSenderNickname] = useState('')
  const [messageToSend, setMessageToSend] = useState('')

  const displayDate = timestamp => {
    const myDate = new Date(timestamp);
      return myDate.toLocaleDateString();
  }

  const scrollToLastMessage = () => {
    const messagesContainer = document.getElementById('messagesContainer')
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
  }

  async function sendMessage() {
    if(messageToSend && messageToSend.trim() !== "") {
      const messageObject = {
        'body': messageToSend.trim(),
        'timestamp': Date.now(),
        'conversationId': conversationId,
        'authorId': context.userConnectedIdContext
      }
  
      try {
        const res = await fetch(`http://localhost:3005/messages/${conversationId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageObject),
        });
  
        if (!res.ok) {
          const message = `An error has occured: ${res.status} - ${res.statusText}`
          throw new Error(message)
        }
  
        const data = await res.json()
  
        setMessages([...messages, data])
        setMessageToSend('')
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  useEffect(() => {
    fetch(`http://localhost:3005/messages/${conversationId}`)
    .then(response => response.json())
    .then(res => setMessages(res))
  }, [])

  useEffect(() => {
    let conversation = context.conversationsContext.find(c => c.id === conversationId)
    if (conversation !== undefined) {
      let isRecipient = context.userConnectedIdContext === conversation.recipientId
      if (isRecipient) {
        setSenderNickname(conversation.senderNickname)
      } else {
        setRecipientNickname(conversation.recipientNickname)
      }
    }
  }, [])

  useEffect(() => {
    scrollToLastMessage()
  }, [sendMessage])

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <button className={styles.backButton} onClick={() => context.setClickCard(false)}>
          <FiArrowLeft />
        </button>
        <p className={styles.titleNames}>{senderNickname ? senderNickname : recipientNickname}</p>
      </div>
      <div
        id='messagesContainer'
        className={styles.messagesContainer}
      >
        {messages.map((mess, index) => {
          let isUserConnected = mess.authorId === context.userConnectedIdContext
          return (
            <div
              key={index}
              className={isUserConnected ? styles.messagesUserConnected : styles.messagesOtherUser}
            >
              {!isUserConnected && <p className={styles.otherUserName}>{senderNickname ? senderNickname : recipientNickname}</p>}
              <p className={isUserConnected ? styles.messageOther : styles.messageUser}>
                <span>{mess.body}</span>
                <span className={styles.timestampDisplay}>{displayDate(mess.timestamp)}</span>
              </p>
            </div>
          )
        })}
      </div>
      <div className={styles.inputArea}>
        <input
          className={styles.input}
          type='text'
          name='text-area'
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
        <button
          className={styles.messageButton}
          disabled={messageToSend.length === 0}
          onClick={sendMessage}
        >
          <FiArrowRightCircle />
        </button>
      </div>
    </div>
  )
}
