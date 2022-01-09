import {combineReducers} from "redux"

import {userSession} from "./user_session"
import {chatrooms} from "./chatrooms"
import {messages} from "./messages"
import {users} from "./users"
import {startGroupChatUsers} from "./start_group_chat_user"

import {messageReducerType} from "./messages"
import {messageType} from "../actions/message"
import {chatroomType} from "../actions/chatroom"
import {userReducerType} from "./users"
import {startGroupChatUserReducer} from "./start_group_chat_user"

export type rootState = {
	sessions: number;
	chatrooms: chatroomType[];
	messages: messageReducerType;
	user: userReducerType;
	startGroupChatUser: startGroupChatUserReducer;
}

const reducer = combineReducers({
	sessions: userSession,
	chatrooms: chatrooms,
	messages: messages,
	user: users,
	startGroupChatUser: startGroupChatUsers
})

export default reducer;