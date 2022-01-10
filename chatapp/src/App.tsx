import React, {useEffect} from 'react';
import {Link, BrowserRouter, Route, Routes} from 'react-router-dom';
import {useDispatch} from "react-redux"

import SignIn from "./components/users/SignIn"
import SignUp from "./components/users/SignUp"
import ChatIndex from "./components/chats/ChatIndex"
import ChatDetail from "./components/chats/ChatDetail"
import GroupChat from "./components/chats/GroupChat"
import GroupChatEdit from "./components/chats/GroupChatEdit"
import StartGroupChat from "./components/chats/StartGroupChat"
import UserShow from "./components/users/UserShow"
import CurrentUserEdit from "./components/users/CurrentUserEdit"

import {getCurrentUser} from "./state/actions"
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type Props = {}

const App: React.FC<Props> = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCurrentUser())
  })

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatIndex/>} />
          <Route path="/chats/:chatId" element={<ChatDetail/>} />
          <Route path="/start_group_chat" element={<StartGroupChat />} />
          <Route path="/group_chats/:chatId" element={<GroupChat/>} />
          <Route path="/group_chats/:chatId/edit" element={<GroupChatEdit />} />
          <Route path="/users/sign_in" element={<SignIn/>} />
          <Route path="/users/sign_up" element={<SignUp/>} />
          <Route path="/users/:user_id" element={<UserShow/>} />
          <Route path="/current_user" element={<CurrentUserEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
