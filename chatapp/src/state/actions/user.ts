import axios from "axios"
import {Dispatch} from "redux"

import {BASE_API_URL} from "../../config/url"
export const GET_USER_SUCCESS = "GET_USER_SUCCESS"
export const GET_USER_FAIL = "GET_USER_FAIL"

// {} を許容するために、? をつけているがどうか？

export type userType = {
	id?: number;
	name?: string;
	first_name?: string;
	last_name?: string;
	description?: string;
	image?: string;
	created_at?: string;
}

export type userActionType = {
	type: string;
	user: userType
}

export const getUser = (user_id: number) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/users/" + user_id.toString(),
			method: "GET"
		}).then((response) => {
			let response_status = response.data.id
			if (response_status != 0 && response_status != undefined) {
				let user = response.data
				dispatch(getUserSuccess(user))
			} else {
				dispatch(getUserFail())
			}
		})
	}
}

export const getUserSuccess = (user: userType): userActionType => {
	return {
		type: GET_USER_SUCCESS,
		user: user
	}
}

export const getUserFail = (): userActionType => {
	return {
		type: GET_USER_FAIL,
		user: {}
	}
}