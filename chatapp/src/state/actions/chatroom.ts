import axios from "axios"
import {Dispatch} from "redux";

import {BASE_API_URL} from "../../config/url"

export const GET_CHATROOM_SUCCESS = "GET_CHATROOM_SUCCESS"
export const GET_CHATROOM_FAIL = "GET_CHATROOM_FAIL"
export const ADD_CHATROOM_SUCCESS = "ADD_CHATROOM_SUCCESS"
export const ADD_CHATROOM_FAIL = "ADD_CHATROOM_FAIL"
export const CREATE_GROUP_CHAT_SUCCESS = "CREATE_GROUP_CHAT_SUCCESS"
export const CREATE_GROUP_CHAT_FAIL = "CREATE_GROUP_CHAT_FAIL"
export const ADD_GROUP_CHAT_SUCCESS = "ADD_GROUP_CHAT_SUCCESS"
export const ADD_GROUP_CHAT_FAIL = "ADD_GROUP_CHAT_FAIL"
export const REMOVE_GROUP_CHAT_SUCCESS = "REMOVE_GROUP_CHAT_SUCCESS"
export const REMOVE_GROUP_CHAT_FAIL = "REMOVE_GROUP_CHAT_FAIL"

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
				console.log(response2)
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

export const createGroupChat = (user_ids: number[]) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let user_ids_params = JSON.stringify(user_ids)
			let csrf_token: string = response["data"]["csrf_token"]
			let params = new URLSearchParams()
			params.append("csrf_token", csrf_token)
			params.append("user_ids", user_ids_params)
			axios({
				url: BASE_API_URL + "/group_chatrooms/new",
				method: "POST",
				data: params,
				withCredentials: true
			}).then((response2) => {
				let response_status = response.data.status
				if (response_status == "success") {
					let chatroom = response2.data.chatroom
					console.log(response2)
					dispatch(createGroupChatSuccess(chatroom))
				} else if (response_status == "fail") {
					dispatch(createGroupChatFail())
				} else if (response_status == "error") {
					dispatch(createGroupChatFail())
				} else {
					dispatch(createGroupChatFail())
				}
			})
		})
	}
}

const createGroupChatSuccess = (chatroom: chatroomType): chatroomAction => {
	return {
		type: CREATE_GROUP_CHAT_SUCCESS,
		chatrooms: [chatroom]
	}
}

const createGroupChatFail = (): chatroomAction => {
	return {
		type: CREATE_GROUP_CHAT_FAIL,
		chatrooms: []
	}
}

export const addGroupChat = (chat_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token = response.data.csrf_token
			let data = new URLSearchParams()
			data.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/chatrooms/" + chat_id + "/add_user",
				method: "POST",
				data: data,
				withCredentials: true
			}).then((response2) => {
				let response_status = response2.data.status
				if (response_status == "success") {
					let chatroom = response2.data.chatroom
					dispatch(addGroupChatSuccess(chatroom))
				} else if (response_status == "fail") {
					dispatch(addGroupChatFail())
				} else if (response_status == "error") {
					dispatch(addGroupChatFail())
				} else {
					dispatch(addGroupChatFail())
				}
			})
		})
	}
}

const addGroupChatSuccess = (chatroom: chatroomType): chatroomAction => {
	return {
		type: ADD_GROUP_CHAT_SUCCESS,
		chatrooms: [chatroom]
	}
}

const addGroupChatFail = (): chatroomAction => {
	return {
		type: ADD_GROUP_CHAT_FAIL,
		chatrooms: []
	}
}

export const removeGroupChat = (chat_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token = response.data.csrf_token
			let data = new URLSearchParams()
			data.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/chatrooms/" + chat_id + "/remove_user",
				method: "POST",
				data: data,
				withCredentials: true
			}).then((response2) => {
				let response_status = response2.data.status
				if (response_status == "success") {
					let chatroom = response2.data.chatroom
					dispatch(removeGroupChatSuccess(chatroom))
				} else if (response_status == "fail") {
					dispatch(removeGroupChatFail())
				} else if (response_status == "error") {
					dispatch(removeGroupChatFail())
				} else {
					dispatch(removeGroupChatFail())
				}
			})
		})
	}
}

const removeGroupChatSuccess = (chatroom: chatroomType): chatroomAction => {
	return {
		type: REMOVE_GROUP_CHAT_SUCCESS,
		chatrooms: [chatroom]
	}
}

const removeGroupChatFail = (): chatroomAction => {
	return {
		type: REMOVE_GROUP_CHAT_FAIL,
		chatrooms: []
	}
}
