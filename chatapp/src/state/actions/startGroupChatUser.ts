import axios from "axios"
import {Dispatch} from "redux"

import {BASE_API_URL} from "../../config/url"
import {userType} from "./user"

export const INIT_START_GROUP_CHAT_USER_SUCCESS = "INIT_START_GROUP_CHAT_USER_SUCCESS"
export const INIT_START_GROUP_CHAT_USER_FAIL = "INIT_START_GROUP_CHAT_USER_FAIL"
export const ADD_START_GROUP_CHAT_USER_SUCCESS = "ADD_START_GROUP_CHAT_USER_SUCCESS"
export const ADD_START_GROUP_CHAT_USER_FAIL = "ADD_START_GROUP_CHAT_USER_FAIL"

export type startGroupChatUserAction = {
	type: string;
	users: userType[];
}

export const initStartGroupChatUser = () => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/current_user/users",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			let response_status: string = response.data.status
			if (response_status == "success") {
				let users: userType[] = response.data.users
				dispatch(initStartGroupChatUserSuccess(users))
			} else if (response_status == "fail") {
				dispatch(initStartGroupChatUserFail())
			} else if (response_status == "error") {
				dispatch(initStartGroupChatUserFail())
			} else {
				dispatch(initStartGroupChatUserFail())
			}
		})
	}
}

const initStartGroupChatUserSuccess = (users: userType[]): startGroupChatUserAction => {
	return {
		type: INIT_START_GROUP_CHAT_USER_SUCCESS,
		users: users
	}
}

const initStartGroupChatUserFail = (): startGroupChatUserAction => {
	return {
		type: INIT_START_GROUP_CHAT_USER_FAIL,
		users: []
	}
}

export const addStartGroupChatUser = (user_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/users/" + user_id.toString(),
			method: "GET"
		}).then((response) => {
			let response_id = response.data.id
			if (response_id != undefined) {
				let user = response.data
				dispatch(addStartGroupChatUserSuccess(user))
			} else {
				dispatch(addStartGroupChatUserFail())
			}
		})
	}
}

const addStartGroupChatUserSuccess = (user: userType): startGroupChatUserAction => {
	return {
		type: ADD_START_GROUP_CHAT_USER_SUCCESS,
		users: [user]
	}
}

const addStartGroupChatUserFail = () => {
	return {
		type: ADD_START_GROUP_CHAT_USER_FAIL,
		users: []
	}
}
