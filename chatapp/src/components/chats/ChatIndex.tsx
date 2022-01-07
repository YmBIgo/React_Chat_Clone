import React, {useEffect, useState} from "react"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"

import {getChatroom, chatroomType} from "../../state/actions/chatroom"
import {rootState} from "../../state/reducers"
import {userType} from "../../state/actions/user"
import {BASE_API_URL} from "../../config/url"
import "../../CSS/chat.css"

type Props = {}

const ChatIndex: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number = useSelector((state: rootState) => state.sessions)
	const chats: chatroomType[] = useSelector((state: rootState) => state.chatrooms)

	const [fixedChats, setFixedChats] = useState<chatroomType[]>([])
	const useeffect_counter = 0

	useEffect(() => {
		if (current_user == 0) {
			// どっかに飛ばす
		}
	}, [current_user])

	useEffect(() => {
		dispatch(getChatroom())
	}, [useeffect_counter])

	const getSingleUser = async (chatroom: chatroomType) => {
		try {
			let response = await axios({
				url: BASE_API_URL + "/chatrooms/" + chatroom.id + "/single_user",
				method: "GET",
				withCredentials: true
			})
			let user_data = response["data"]["user"]
			return user_data
		} catch(error) {
			console.log(error)
			return []
		}
	}

	const getLastMessage = async (chatroom: chatroomType) => {
		try {
			let response = await axios({
				url: BASE_API_URL + "/chatrooms/" + chatroom.id + "/last_message",
				method: "GET",
				withCredentials: true
			})
			let message_status = response["data"]["status"]
			if (message_status == "success") {
				let message_data = response["data"]["messages"]
				return message_data
			} else {
				return {}
			}
		} catch(error) {
			console.log(error)
			return []
		}
	}

	const getSingleUserImage = async (chatroom: chatroomType, index: number) => {
		let user  = await getSingleUser(chatroom)
		let chat_image = document.getElementsByClassName("chat-index-chat-img")[index] as HTMLImageElement
		chat_image.setAttribute("src", user.image)
		let chat_text  = document.getElementsByClassName("chat-index-chat-name")[index] as HTMLSpanElement
		chat_text.innerText = user.name
	}

	const getLastMessageData = async (chatroom: chatroomType, index: number) => {
		let message = await getLastMessage(chatroom)
		let message_html = document.getElementsByClassName("chat-index-chat-last-message")[index] as HTMLSpanElement
		if ( message.content == undefined) {
			message_html.innerText = "チャットを始めよう！"
		} else {
			if (message.content == "") {
				message_html.innerText = "[画像]"
			} else {
				message.html.innerText = message.content
			}
		}
	}

	return(
		<div className="chat-index-area">
			<div className="row">
				<div className="col-2">
					<div className="chat-index-sidebar">
					</div>
				</div>
				<div className="col-10">
					<div className="chat-index-chat-inner">
						<h2>チャット一覧</h2>
						<hr />
						<div>
							{chats.map((chat, index) => {
								{chat.is_group === false && getSingleUserImage(chat, index)}
								{getLastMessageData(chat, index)}
								return chat.is_group === false ?
									<Link to={"/chats/"+chat.id} className="chat-index-chat-panel">
										<div className="row">
											<div className="col-3">
												<img src="" className="chat-index-chat-img" />
											</div>
											<div className="col-9">
												<span className="chat-index-chat-name">
												</span>
												<br/>
												<small className="chat-index-chat-last-message">
												</small>
											</div>
										</div>
										<hr />
									</Link>
								:
									<Link to={"/chats/"+chat.id} className="chat-index-chat-panel">
										<div className="row">
											<div className="col-3">
												<img src={chat.image} className="chat-index-chat-img" />
											</div>
											<div className="col-9">
												<span className="chat-index-chat-name">
													{chat.name}
												</span>
												<br/>
												<small className="chat-index-chat-last-message">
												</small>
											</div>
										</div>
										<hr />
									</Link>
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatIndex;