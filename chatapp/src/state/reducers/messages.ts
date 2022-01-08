import {GET_MESSAGE_SUCCESS, GET_MESSAGE_FAIL,
		ADD_MESSAGE_SUCCESS, ADD_MESSAGE_FAIL,
		messageType, messageActionType} from "../actions/message"

export type messageReducerType = {
	messages: messageType[];
	status: string;
}

export const messages = (state: messageReducerType = {"messages": [], "status": ""},
						 action: messageActionType) => {
	switch(action.type){
		case GET_MESSAGE_SUCCESS:
			return {"status": "success", "messages": action.messages.reverse()}
		case GET_MESSAGE_FAIL:
			return {"messages": [], "status": "fail"}
		case ADD_MESSAGE_SUCCESS:
			return {"status": "success", "messages": [...state.messages, ...action.messages] }
		case ADD_MESSAGE_FAIL:
			return state
		default:
			return state
	}
}