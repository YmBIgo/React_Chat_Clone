import {combineReducers} from "redux"

import {userSession} from "./user_session"
import {chats} from "./chats"
import {chatroomType} from "../actions/chat"

export type rootState = {
	sessions: number;
	chats: chatroomType[];
}

const reducer = combineReducers({
	sessions: userSession,
	chats: chats,
})

export default reducer;