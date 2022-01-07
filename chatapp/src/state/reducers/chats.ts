import {GET_CHATROOM_SUCCESS, GET_CHATROOM_FAIL,
		chatroomType, chatroomAction} from "../actions/chat"

export const chats = (state: chatroomType[] = [], action: chatroomAction) => {
	switch(action.type){
		case GET_CHATROOM_SUCCESS:
			return action.chatrooms
		case GET_CHATROOM_FAIL:
			return []
		default:
			return state
	}
}