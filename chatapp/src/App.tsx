import React, {useEffect} from 'react';
import {Link, BrowserRouter, Route, Routes} from 'react-router-dom';
import {useDispatch} from "react-redux"

import SignIn from "./components/users/SignIn"
import SignUp from "./components/users/SignUp"
import ChatIndex from "./components/chats/ChatIndex"
import ChatDetail from "./components/chats/ChatDetail"
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
          <Route path="/chats/:id" element={<ChatDetail/>} />
          <Route path="/users/sign_in" element={<SignIn/>} />
          <Route path="/users/sign_up" element={<SignUp/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
