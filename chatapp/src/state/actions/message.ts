import axios from "axios"
import {Dispatch} from "redux"
import {BASE_API_URL} from "../../config/url"

export const GET_MESSAGE_SUCCESS = "GET_MESSAGE_SUCCESS"
export const GET_MESSAGE_FAIL = "GET_MESSAGE_FAIL"
export const CONCAT_MESSAGE_SUCCESS = "CONCAT_MESSAGE_SUCCESS"
export const CONCAT_MESSAGE_FAIL = "CONCAT_MESSAGE_FAIL"
export const ADD_MESSAGE_SUCCESS = "ADD_MESSAGE_SUCCESS"
export const ADD_MESSAGE_FAIL = "ADD_MESSAGE_FAIL"

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

export const addMessageSuccess = (messages: messageType[]): messageActionType => {
	return {
		type: ADD_MESSAGE_SUCCESS,
		messages: messages
	}
}

export const addMessageFail = (): messageActionType => {
	return {
		type: ADD_MESSAGE_FAIL,
		messages: []
	}
}