import React, {useEffect} from "react"
import axios from "axios"
import {Link} from "react-router-dom"

import {BASE_API_URL} from "../../config/url"
import {chatroomType} from "../../state/actions/chatroom"
import {messageType} from "../../state/actions/message"
import "../../CSS/chat.css"

type Props = {
	chat: chatroomType;
	current_user: number
}

const ChatIndexChat: React.FC<Props> = ({chat, current_user}) => {

	const chatsImageRef = React.createRef<HTMLImageElement>()
	const chatsNameRef = React.createRef<HTMLSpanElement>()
	const chatsMessageRef = React.createRef<HTMLDivElement>()

	useEffect(() => {
		if (chat.is_group == false) {
			getSingleUser(chat)
		}
		getLastMessage(chat)
	}, [])

	const getSingleUser = (chatroom: chatroomType) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom.id + "/single_user",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			let user_data = response["data"]["user"]
			let image_html = chatsImageRef.current as HTMLImageElement
			let name_html = chatsNameRef.current as HTMLSpanElement
			image_html.setAttribute("src", user_data.image)
			name_html.innerText = user_data.name
		})
	}

	const getLastMessage = (chatroom: chatroomType) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom.id + "/last_message",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			let message_status = response["data"]["status"]
			if (message_status == "success") {
				let message_data: messageType = response["data"]["messages"]
				let message_html = chatsMessageRef.current as HTMLDivElement
				if (message_data["content"] == undefined) {
					message_html.innerText = "チャットを始めよう！"
				} else {
					if (message_data["content"] == "") {
						message_html.innerText = "[画像]"
					} else {
						message_html.innerText = message_data["content"]
					}
				}
			} else {
				let message_html = chatsMessageRef.current as HTMLDivElement
				let message_message = response["data"]["message"]
				if (message_message == "message not exist") {
					message_html.innerText = "チャットを始めよう！"
				} else {
					let message_html = chatsMessageRef.current as HTMLDivElement
					message_html.innerText = "Error"
				}
			}
		})
	}

	return(
		chat.is_group === false ?
			<Link to={"/chats/"+chat.id} className="chat-index-chat-panel">
				<div className="row">
					<div className="col-3">
						<img src="" className="chat-index-chat-img" ref={chatsImageRef} />
					</div>
					<div className="col-9">
						<span className="chat-index-chat-name" ref={chatsNameRef}>
						</span>
						<br/>
						<div className="chat-index-chat-last-message" ref={chatsMessageRef} >
						</div>
					</div>
				</div>
				<hr />
			</Link>
		:
			<Link to={"/chats/"+chat.id} className="chat-index-chat-panel">
				<div className="row">
					<div className="col-3">
						<img src={chat.image} className="chat-index-chat-img" ref={chatsImageRef} />
					</div>
					<div className="col-9">
						<span className="chat-index-chat-name" ref={chatsNameRef}>
							{chat.name}
						</span>
						<br/>
						<div className="chat-index-chat-last-message" ref={chatsMessageRef} >
						</div>
					</div>
				</div>
				<hr />
			</Link>
	)
}

export default ChatIndexChat