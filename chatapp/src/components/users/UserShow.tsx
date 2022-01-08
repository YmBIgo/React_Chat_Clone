import React, {useEffect, useState} from "react"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {useParams, useNavigate, Link} from "react-router-dom"

import {addChatroom} from "../../state/actions/chatroom"
import {getUser} from "../../state/actions/user"
import {userReducerType} from "../../state/reducers/users"
import {getCurrentUser} from "../../state/actions"
import {userType} from "../../state/actions/user"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"

import UserShowFooter from "./UserShowFooter"
import "../../CSS/user.css"

type Props = {}

const UserShow: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const user_: userReducerType = useSelector((state: rootState) => state.user)
	const user: userType = user_.user
	const navigate = useNavigate()
	const params = useParams()
	const user_id = Number(params.user_id)

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
	}, [current_user])

	useEffect(() => {
		dispatch(getUser(user_id))
	}, [user_id])

	const startChat = (e: React.MouseEvent<HTMLElement>) => {
		dispatch(addChatroom(user_id))
		navigate("/")
	}

	return(
		<div className="user-show-area">
			<Link to="/">＜　トップに戻る</Link>
			<div className="user-show-logo-wrapper">
				<img src={user.image} className="user-show-logo-image" />
				<div className="user-show-name">
					<h1>{user.name}</h1>
					<p>{user.description}</p>
				</div>
			</div>
			<UserShowFooter current_user={current_user} startChat={startChat} />
		</div>
	)
}

export default UserShow;