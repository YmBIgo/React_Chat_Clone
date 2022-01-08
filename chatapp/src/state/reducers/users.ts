import {GET_USER_SUCCESS, GET_USER_FAIL,
		userActionType, userType} from "../actions/user"

export type userReducerType = {
	status: string
	user: userType
}

export const users = (state: userReducerType = {"status": "", user: {}},
					  action: userActionType) => {
	switch(action.type) {
		case GET_USER_SUCCESS:
			return {"status": "success", "user": action.user}
		case GET_USER_FAIL:
			return {"status": "fail", "user": []}
		default:
			return state
	}
}