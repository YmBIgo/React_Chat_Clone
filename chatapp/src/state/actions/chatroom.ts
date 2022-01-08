import axios from "axios"
import {Dispatch} from "redux";

import {BASE_API_URL} from "../../config/url"

export const GET_CHATROOM_SUCCESS = "GET_CHATROOM_SUCCESS"
export const GET_CHATROOM_FAIL = "GET_CHATROOM_FAIL"
export const ADD_CHATROOM_SUCCESS = "ADD_CHATROOM_SUCCESS"
export const ADD_CHATROOM_FAIL = "ADD_CHATROOM_FAIL"

export type chatroomType = {
	id?: number;
	name?: string;
	image?: string;
	is_group?: boolean;
}

export type chatroomAction = {
	chatrooms: chatroomType[];
	type: string;
}

export const getChatroom = () => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/current_chatrooms",
			withCredentials: true,
		}).then((response) => {
			let response_status: string = response["data"]["status"]
			if (response_status === "success") {
				let chatrooms: chatroomType[] = response["data"]["chatrooms"]
				dispatch(getChatroomSuccess(chatrooms))
			} else if (response_status === "fail") {
				dispatch(getChatroomFail())
			} else if (response_status === "error") {
				dispatch(getChatroomFail())
			}
		})
	}
}

export const getChatroomSuccess = (chatrooms: chatroomType[]): chatroomAction => {
	return {
		chatrooms: chatrooms,
		type: GET_CHATROOM_SUCCESS
	}
}

export const getChatroomFail = (): chatroomAction => {
	return {
		chatrooms: [],
		type: GET_CHATROOM_FAIL
	}
}

export const addChatroom = (user_id: number) => {
	return(dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let params = new URLSearchParams()
			let csrf_token: string = response["data"]["csrf_token"]
			params.append("user_id", user_id.toString())
			params.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/chatrooms/new",
				method: "POST",
				data: params,
				withCredentials: true
			}).then((response2) => {
				const response_status = response2.data.status
				if (response_status == "success") {
					dispatch(addChatroomSuccess(response2.data.chatroom))
				} else if (response_status == "fail") {
					dispatch(addChatRoomFail())
				} else if (response_status == "error") {
					dispatch(addChatRoomFail())
				} else {
					dispatch(addChatRoomFail())
				}
			})
		})
	}
}

const addChatroomSuccess = (chatroom: chatroomType): chatroomAction => {
	return {
		type: ADD_CHATROOM_SUCCESS,
		chatrooms: [chatroom]
	}
}

const addChatRoomFail = (): chatroomAction => {
	return {
		type: ADD_CHATROOM_FAIL,
		chatrooms: []
	}
}
