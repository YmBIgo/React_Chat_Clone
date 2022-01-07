import {USER_SIGN_IN_SUCCESS, USER_SIGN_IN_FAIL,
		userSignInUpType, } from "../actions"

export const userSession = (state: number, action: userSignInUpType) => {
	switch(action.type){
		case USER_SIGN_IN_SUCCESS:
			return action.user_id
		case USER_SIGN_IN_FAIL:
			return 0
		default:
			return 0
	}
}