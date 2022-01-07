import {GET_MESSAGE_SUCCESS, GET_MESSAGE_FAIL,
		ADD_MESSAGE_SUCCESS, ADD_MESSAGE_FAIL,
		messageType, messageActionType} from "../actions/message"

type messageReducerType = {
	messages: messageType[];
	status: string;
}

export const messages = (state: messageType[] = [], action: messageActionType) => {
	switch(action.type){
		case GET_MESSAGE_SUCCESS:
			return action.messages
		case GET_MESSAGE_FAIL:
			return []
		case ADD_MESSAGE_SUCCESS:
			return [...state, ...action.messages]
		case ADD_MESSAGE_FAIL:
			return state
		default:
			return state
	}
}