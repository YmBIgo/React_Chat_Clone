import axios from "axios"
import {Dispatch} from "redux";

import {BASE_API_URL} from "../../config/url"

export const USER_SIGN_IN_SUCCESS: string = "USER_SIGN_IN_SUCCESS"
export const USER_SIGN_IN_FAIL: string = "USER_SIGN_IN_FAIL"

// User Sign in up

export type userSignInUpType = {
	user_id: number;
	type: string;
}

export const getCurrentUser = () => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/current_user",
			withCredentials: true
		}).then((response) => {
			let response_status = response["data"]["status"]
			if (response_status == "success") {
				let user_id = response["data"]["user"]["id"]
				dispatch(userSignInSuccess(user_id))
			} else if (response_status == "fail") {
				dispatch(userSignInFail())
			}
		})
	}
}

export const userSignUp = (email: string, password: string, user_name: string) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token: string = response["data"]["csrf_token"]
			let params = new URLSearchParams()
			params.append("email", email);
			params.append("password", password);
			params.append("user_name", user_name);
			params.append("csrf_token", csrf_token);
			axios({
				url: BASE_API_URL + "/users/sign_up",
				method: "POST",
				data: params,
				withCredentials: true
			}).then((response) => {
				console.log(response)
				let response_status = response["data"]["status"]
				if (response_status == "success") {
					let user_id = response["data"]["userId"]
					dispatch(userSignInSuccess(user_id))
				} else {
					dispatch(userSignInFail())
				}
			})
		})
	}
}

export const userSignIn = (email: string, password: string) => {
	return (dispatch: Dispatch) => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token: string = response["data"]["csrf_token"]
			let params = new URLSearchParams()
			params.append("email", email);
			params.append("password", password);
			params.append("csrf_token", csrf_token);
			axios({
				url: BASE_API_URL + "/users/sign_in",
				method: "POST",
				data: params,
				withCredentials: true,
			}).then((response) => {
				console.log(response)
				let response_status = response["data"]["status"]
				if (response_status == "success"){
					let user = response["data"]["user"]
					dispatch(userSignInSuccess(user["id"]))
				} else if (response_status == "fail") {
					dispatch(userSignInFail())
				} else if (response_status == "error") {
					dispatch(userSignInFail())
				}
			})
		})
	}
}

const userSignInSuccess = (user_id: number): userSignInUpType => {
	return {
		user_id: user_id,
		type: USER_SIGN_IN_SUCCESS,
	}
}

const userSignInFail = (): userSignInUpType => {
	return {
		user_id: 0,
		type: USER_SIGN_IN_FAIL,
	}
}