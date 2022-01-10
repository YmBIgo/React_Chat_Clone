import axios from "axios"
import {Dispatch} from "redux"
import {BASE_API_URL} from "../../config/url"

export const GET_MESSAGE_SUCCESS = "GET_MESSAGE_SUCCESS"
export const GET_MESSAGE_FAIL = "GET_MESSAGE_FAIL"
export const CONCAT_MESSAGE_SUCCESS = "CONCAT_MESSAGE_SUCCESS"
export const CONCAT_MESSAGE_FAIL = "CONCAT_MESSAGE_FAIL"
export const ADD_MESSAGE_SUCCESS = "ADD_MESSAGE_SUCCESS"
export const ADD_MESSAGE_FAIL = "ADD_MESSAGE_FAIL"
export const CHECK_UNREAD_MESSAGE_SUCCESS = "CHECK_UNREAD_MESSAGE_SUCCESS"
export const CHECK_UNREAD_MESSAGE_FAIL = "CHECK_UNREAD_MESSAGE_FAIL"

export type messageType = {
	id: number;
	content: string;
	image: string;
	created_at: string;
	user_id: number
}

export type messageActionType = {
	type: string;
	messages: messageType[];
}

// Get Message

export const getMessages = (chatroom_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom_id.toString() + "/messages?offset=0",
			method: "GET",
			withCredentials: true
 		}).then((response) => {
 			let response_status = response["data"]["status"]
 			if (response_status === "success") {
 				let messages = response["data"]["messages"]
 				dispatch(getMessageSuccess(messages))
 			} else if (response_status === "fail") {
 				dispatch(getMessageFail())
 			} else if (response_status === "error") {
 				dispatch(getMessageFail())
 			} else {
 				dispatch(getMessageFail())
 			}
 		})
	}
}

const getMessageSuccess = (messages: messageType[]): messageActionType => {
	return {
		type : GET_MESSAGE_SUCCESS,
		messages: messages
	}
}

const getMessageFail = (): messageActionType => {
	return {
		type: GET_MESSAGE_FAIL,
		messages: []
	}
}

// AddMessage

// image が any になっている
export const addMessage = (content: string, image: any, chatroom_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token: string = response["data"]["csrf_token"]
			let params = new FormData();
			params.append("content", content);
			params.append("image", image);
			params.append("csrf_token", csrf_token);
			axios({
				url: BASE_API_URL + "/chatrooms/" + chatroom_id.toString() + "/messages",
				method: "POST",
				withCredentials: true,
				data: params,
				headers: {'content-type': 'multipart/form-data'}
			}).then((response2) => {
				let response_status = response2["data"]["status"]
				if (response_status === "success") {
					let message: messageType[] = [response2["data"]["messages"]]
					dispatch(addMessageSuccess(message))
				} else if (response_status === "fail") {
					dispatch(addMessageFail())
				} else if (response_status === "error") {
					dispatch(addMessageFail())
				} else {
					dispatch(addMessageFail())
				}
			})
		})
	}
}

const addMessageSuccess = (messages: messageType[]): messageActionType => {
	return {
		type: ADD_MESSAGE_SUCCESS,
		messages: messages
	}
}

const addMessageFail = (): messageActionType => {
	return {
		type: ADD_MESSAGE_FAIL,
		messages: []
	}
}

// Concat Message

export const concatMessage = (chatroom_id: number, offset: number) => {
	return (dispatch: Dispatch) => {
		console.log(offset)
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom_id.toString() + "/messages?offset=" + offset.toString(),
			method: "GET",
			withCredentials: true
 		}).then((response) => {
 			let response_status = response["data"]["status"]
 			if (response_status === "success") {
 				let messages = response["data"]["messages"]
 				dispatch(concatMessageSuccess(messages))
 			} else if (response_status === "fail") {
 				dispatch(concatMessageFail())
 			} else if (response_status === "error") {
 				dispatch(concatMessageFail())
 			} else {
 				dispatch(concatMessageFail())
 			}
 		})
	}
}

const concatMessageSuccess = (messages: messageType[]): messageActionType => {
	return {
		type: CONCAT_MESSAGE_SUCCESS,
		messages: messages
	}
}

const concatMessageFail = (): messageActionType => {
	return {
		type: CONCAT_MESSAGE_FAIL,
		messages: []
	}
}

export const checkUnreadMessage = (chatroom_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom_id.toString() + "/unread_message",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			let response_status = response.data.status
			if (response_status == "success") {
				let messages = response.data.unread_messages
				dispatch(checkUnreadMessageSuccess(messages))
			} else if (response_status == "fail") {
				dispatch(checkUnreadMessageFail())
			} else if (response_status == "error") {
				dispatch(checkUnreadMessageFail())
			} else {
				dispatch(checkUnreadMessageFail())
			}
		})
	}
}

const checkUnreadMessageSuccess = (messages: messageType[]): messageActionType => {
	return {
		type: CHECK_UNREAD_MESSAGE_SUCCESS,
		messages: messages
	}
}

const checkUnreadMessageFail = (): messageActionType => {
	return {
		type: CHECK_UNREAD_MESSAGE_FAIL,
		messages: []
	}
}
