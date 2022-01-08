import {combineReducers} from "redux"

import {userSession} from "./user_session"
import {chatrooms} from "./chatrooms"
import {messages} from "./messages"
import {users} from "./users"

import {messageReducerType} from "./messages"
import {messageType} from "../actions/message"
import {chatroomType} from "../actions/chatroom"
import {userReducerType} from "./users"

export type rootState = {
	sessions: number;
	chatrooms: chatroomType[];
	messages: messageReducerType;
	user: userReducerType;
}

const reducer = combineReducers({
	sessions: userSession,
	chatrooms: chatrooms,
	messages: messages,
	user: users
})

export default reducer;