import axios from "axios"
import {Dispatch} from "redux";

import {BASE_API_URL} from "../../config/url"

export const GET_CHATROOM_SUCCESS = "GET_CHATROOM_SUCCESS"
export const GET_CHATROOM_FAIL = "GET_CHATROOM_FAIL"

export type chatroomType = {
	id: number;
	name: string;
	image: string;
	is_group: boolean;
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
