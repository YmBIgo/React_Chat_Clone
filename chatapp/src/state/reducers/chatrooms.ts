import {GET_CHATROOM_SUCCESS, GET_CHATROOM_FAIL,
		ADD_CHATROOM_SUCCESS, ADD_CHATROOM_FAIL, 
		CREATE_GROUP_CHAT_SUCCESS, CREATE_GROUP_CHAT_FAIL,
		ADD_GROUP_CHAT_SUCCESS, ADD_GROUP_CHAT_FAIL,
		REMOVE_GROUP_CHAT_SUCCESS, REMOVE_GROUP_CHAT_FAIL,
		chatroomType, chatroomAction} from "../actions/chatroom"

export const chatrooms = (state: chatroomType[] = [], action: chatroomAction) => {
	switch(action.type){
		case GET_CHATROOM_SUCCESS:
			return action.chatrooms
		case GET_CHATROOM_FAIL:
			return []
		case ADD_CHATROOM_SUCCESS:
			return [...state, ...action.chatrooms]
		case ADD_CHATROOM_FAIL:
			return state
		case CREATE_GROUP_CHAT_SUCCESS:
			console.log(state, action.chatrooms)
			return [...state, ...action.chatrooms]
		case CREATE_GROUP_CHAT_FAIL:
			return state
		case ADD_GROUP_CHAT_SUCCESS:
			return [...state, ...action.chatrooms]
		case ADD_GROUP_CHAT_FAIL:
			return state
		case REMOVE_GROUP_CHAT_SUCCESS:
			let filterd_state = state.filter((item) => item.id != action.chatrooms[0].id)
			return filterd_state
		case REMOVE_GROUP_CHAT_FAIL:
			return state
		default:
			return state
	}
}