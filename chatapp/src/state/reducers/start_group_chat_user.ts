import {INIT_START_GROUP_CHAT_USER_SUCCESS, INIT_START_GROUP_CHAT_USER_FAIL,
		ADD_START_GROUP_CHAT_USER_SUCCESS, ADD_START_GROUP_CHAT_USER_FAIL,
		startGroupChatUserAction} from "../actions/startGroupChatUser"
import {userType} from "../actions/user"

export type startGroupChatUserReducer = {
	status: string
	users: userType[]
}

export const startGroupChatUsers = (state: startGroupChatUserReducer = {"status": "pending", "users": []},
									action: startGroupChatUserAction) =>
{
	switch(action.type){
		case INIT_START_GROUP_CHAT_USER_SUCCESS:
			return {"status": "success", users: action.users}
		case INIT_START_GROUP_CHAT_USER_FAIL:
			return {"status": "fail", users: []}
		case ADD_START_GROUP_CHAT_USER_SUCCESS:
			// 内容チェック
			let user_ids = []
			for (let key in state.users) {
				if (state.users[key].id == action.users[0].id) {
					return state
				}
			}
			return {"status": "success", users: [...state.users, ...action.users]}
		case ADD_START_GROUP_CHAT_USER_FAIL:
			return state
		default:
			return state
	}
}