import {combineReducers} from "redux"

import {userSession} from "./user_session"
import {chatrooms} from "./chatrooms"
import {messages} from "./messages"

import {messageType} from "../actions/message"
import {chatroomType} from "../actions/chatroom"

export type rootState = {
	sessions: number;
	chatrooms: chatroomType[];
	messages: messageType[];
}

const reducer = combineReducers({
	sessions: userSession,
	chatrooms: chatrooms,
	messages: messages
})

export default reducer;