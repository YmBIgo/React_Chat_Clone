import {GET_CHATROOM_SUCCESS, GET_CHATROOM_FAIL,
		ADD_CHATROOM_SUCCESS, ADD_CHATROOM_FAIL, 
		chatroomType, chatroomAction} from "../actions/chatroom"

export const chatrooms = (state: chatroomType[] = [], action: chatroomAction) => {
	switch(action.type){
		case GET_CHATROOM_SUCCESS:
			return action.chatrooms
		case GET_CHATROOM_FAIL:
			return []
		case ADD_CHATROOM_SUCCESS:
			console.log(state, action.chatrooms)
			return [...state, ...action.chatrooms]
		case ADD_CHATROOM_FAIL:
			return state
		default:
			return state
	}
}