import React, {useEffect, useState} from "react"
import axios from "axios"
import {useSelector} from "react-redux"
import {Link} from "react-router-dom"

import {userReducerType} from "../../state/reducers/users"
import {userType} from "../../state/actions/user"
import {chatroomType} from "../../state/actions/chatroom"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"

import "../../CSS/user.css"

type Props = {
	current_user: number;
	startChat: any;
}

const UserShowFooter: React.FC<Props> = ({current_user, startChat}) => {

	const user_: userReducerType = useSelector((state: rootState) => state.user)
	const user: userType = user_.user

	useEffect(() => {
		if (user.id != undefined) {
			getUserChatExist()
		}
	}, [user])

	const [isChat, setIsChat] = useState<boolean>(false)
	const [chatroom, setChatroom] = useState<chatroomType>({})

	const getUserChatExist = async () => {
		try{
			let response = await axios({
				url: BASE_API_URL + "/users/" + user.id + "/is_chat",
				method: "GET",
				withCredentials: true
			})
			setIsChat(response.data.isChat)
			setChatroom(response.data.chatroom)
		} catch (error) {
			console.log(error)
		}
	}

	return(
		<div>
			{isChat == true ?
				<div className="user-show-footer">
					<Link to={"/chats/"+chatroom.id}>
						<h2>
						チャットルームを見る
						</h2>
					</Link>
				</div>
			:
				<div className="user-show-footer">
					<h2>
						<button onClick={startChat}>
							チャットを始める
						</button>
					</h2>
				</div>
			}
		</div>
	)
}

export default UserShowFooter;