import { FC, useContext, useState } from 'react'
import { Context } from '../pages/index'
import styles from '../styles/Conversation.module.css'
import { Avatar } from './Avatar'
import { Modal } from './Modal'
import { BiMessageRoundedAdd } from "react-icons/bi";

export const Conversation: FC = () => {
  const context = useContext(Context)
  const [isModal, setModal] = useState(false);
  
  const displayDate = (timestamp: number )=> {
    const myDate = new Date(timestamp);
      return myDate.toLocaleDateString();
  }

  return (
    <div className={styles.contentWrapper}>
      <button
        className={styles.newMessageButton}
        onClick={() => setModal(true)}
      >
        <BiMessageRoundedAdd />
      </button>
      <div className={styles.conversationsWrapper}>
        {context.conversationsContext.map((conversation, index) => {
          let nickname = conversation.recipientId !== context.userConnectedIdContext
            ? conversation.recipientNickname
            : conversation.senderNickname
          return (
            <div
              className={styles.cardContainer}
              key={index}
              onClick={() => {context.setClickCard(true); context.setConversationId(conversation.id)}}
            >
              <div className={styles.picture}>
                <Avatar name={nickname} />
              </div>
              <div className={styles.description}>
                <p>{nickname}</p>
                <p>Create on {displayDate(conversation.lastMessageTimestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>
      {isModal && <Modal onClose={setModal} />}
    </div>
  )
}
