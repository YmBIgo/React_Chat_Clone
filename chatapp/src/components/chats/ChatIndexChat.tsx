import React, {useEffect, useState} from "react"
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

	const [unreadLength, setUnreadLength] = useState<number>(0)

	// const chatsImageRef = React.createRef<HTMLImageElement>()
	// const chatsNameRef = React.createRef<HTMLSpanElement>()
	const chatsMessageRef = React.createRef<HTMLDivElement>()

	const [chatImage, setChatImage] = useState("")
	const [chatName, setChatName] = useState("")
	const [chatMessage, setChatMessage] = useState("")

	useEffect(() => {
		if (chat.is_group == false) {
			getSingleUser(chat)
		}
		getLastMessage(chat)
	}, [])

	useEffect(() => {
		getUnreadMessagesCount()
	}, [])

	const getSingleUser = (chatroom: chatroomType) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chatroom.id + "/single_user",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			let user_data = response["data"]["user"]
			// let image_html = chatsImageRef.current as HTMLImageElement
			// image_html.setAttribute("src", user_data.image)
			setChatImage(user_data.image)
			// let name_html = chatsNameRef.current as HTMLSpanElement
			// name_html.innerText = user_data.name
			setChatName(user_data.name)
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
				// let message_html = chatsMessageRef.current as HTMLDivElement
				if (message_data["content"] == undefined) {
					// message_html.innerText = "チャットを始めよう！"
					setChatMessage("チャットを始めよう！")
				} else {
					if (message_data["content"] == "") {
						// message_html.innerText = "[画像]"
						setChatMessage("[画像]")
					} else {
						// message_html.innerText = message_data["content"]
						setChatMessage(message_data["content"])
					}
				}
			} else {
				// let message_html = chatsMessageRef.current as HTMLDivElement
				let message_message = response["data"]["message"]
				if (message_message == "message not exist") {
					// message_html.innerText = "チャットを始めよう！"
					setChatMessage("チャットを始めよう！")
				} else {
					// let message_html = chatsMessageRef.current as HTMLDivElement
					// message_html.innerText = "Error"
					setChatMessage("Error")
				}
			}
		})
	}

	const getUnreadMessagesCount = () => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chat.id + "/unread_message",
			method: "GET",
			withCredentials: true
		}).then((response) => {
			setUnreadLength(response.data.unread_messages.length)
		})
	}

	return(
		chat.is_group === false ?
			<Link to={"/chats/"+chat.id} className="chat-index-chat-panel">
				<div className="row">
					<div className="col-3">
						<img src={chatImage} className="chat-index-chat-img" />
					</div>
					<div className="col-7">
						<span className="chat-index-chat-name">
							{chatName}
						</span>
						<br/>
						<div className="chat-index-chat-last-message" >
							{chatMessage}
						</div>
					</div>
					<div className="col-2">
						{unreadLength > 0 &&
							<div className="chat-index-chat-unread-message-length">
								{unreadLength}
							</div>
						}
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
					<div className="col-7">
						<span className="chat-index-chat-name">
							{chat.name}
						</span>
						<br/>
						<div className="chat-index-chat-last-message" >
							{chatMessage}
						</div>
					</div>
					<div className="col-2">
						{unreadLength > 0 &&
							<div className="chat-index-chat-unread-message-length">
								{unreadLength}
							</div>
						}
					</div>
				</div>
				<hr />
			</Link>
	)
}

export default ChatIndexChat