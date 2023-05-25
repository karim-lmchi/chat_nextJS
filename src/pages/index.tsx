import { FC, Dispatch, SetStateAction, useState, useEffect, createContext } from 'react'
import { Conversation } from '../components/Conversation'
import { Message } from '../components/Message'
import { ConversationType } from '../types/conversation'
import { User } from '../types/user'

type ContextType = {
  usersContext: User[],
  userConnectedIdContext: number,
  conversationsContext: ConversationType[],
  setConversations: Dispatch<SetStateAction<ConversationType[]>>,
  setUsers: Dispatch<SetStateAction<User[]>>,
  setClickCard: Dispatch<SetStateAction<boolean>>,
  setConversationId: Dispatch<SetStateAction<number>>,
}
export const Context = createContext<ContextType>({
  usersContext: [],
  userConnectedIdContext: 1,
  conversationsContext: [],
  setConversations: () => {},
  setUsers: () => {},
  setClickCard: () => {},
  setConversationId: () => {},
})
const Home: FC = () => {
  const [conversations, setConversations] = useState([])
  const [users, setUsers] = useState([])
  const userConnectedId = 1
  const [conversationId, setConversationId] = useState(undefined);
  const [clickCard, setClickCard] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3005/conversations/${userConnectedId}`)
    .then(response => response.json())
    .then(res => setConversations(res))
  }, [setConversations])

  useEffect(() => {
    fetch('http://localhost:3005/users')
    .then(response => response.json())
    .then(res => setUsers(res))
  }, [setUsers])

  return (
    <Context.Provider value={{
      usersContext: users,
      userConnectedIdContext: userConnectedId,
      conversationsContext: conversations,
      setConversations: setConversations,
      setUsers: setUsers,
      setClickCard: setClickCard,
      setConversationId: setConversationId,
    }}
    >
      {clickCard
        ? <Message conversationId={conversationId} />
        : <Conversation />
      }
    </Context.Provider>
  )
}

export default Home