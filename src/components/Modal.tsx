import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Context } from '../pages/index'
import styles from '../styles/Modal.module.css'

type ModalType = {
  onClose: Dispatch<SetStateAction<boolean>>,
}

export const Modal = ({ onClose }: ModalType) => {
  const context = useContext(Context)
  const [newUser, setNewUser] = useState('')

  const userId = Math.floor((1 + Math.random()) * 0x10000);

  async function createUser() {
    const userObject = {
      "id": userId,
      "nickname": newUser.trim(),
      "token": "xxxx"
    }

    try {
      const res = await fetch('http://localhost:3005/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObject),
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`
        throw new Error(message)
      }

      const data = await res.json()

      context.setUsers([...context.usersContext, data])
    } catch (err) {
      console.log(err.message);
    }
  }

  async function createConversation() {
    const userObject = {
      "id": Math.floor((1 + Math.random()) * 0x10000),
      "recipientId": userId,
      "recipientNickname": newUser.trim(),
      "senderId": 1,
      "senderNickname": "Thibaut",
      "lastMessageTimestamp": Date.now()
    }

    try {
      const res = await fetch(`http://localhost:3005/conversations/${context.userConnectedIdContext}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userObject),
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`
        throw new Error(message)
      }

      const data = await res.json()

      context.setConversations([...context.conversationsContext, data])
    } catch (err) {
      console.log(err.message);
    }
  }

  const validateNewUser = () => {
    if (newUser && newUser.trim() !== "") {
      createUser()
      createConversation()
      onClose(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.modalText}>Contact Name</p>
        <input
          className={styles.modalInput}
          type='text'
          name='text-area'
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <div className={styles.action}>
          <button className={styles.newButton} onClick={validateNewUser}>New</button>
          <button className={styles.cancelButton} onClick={() => onClose(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}