import React, {useEffect, useState} from "react"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {Link, useNavigate} from "react-router-dom"

import {getChatroom, chatroomType} from "../../state/actions/chatroom"
import {getCurrentUser} from "../../state/actions"
import {rootState} from "../../state/reducers"
import {userType} from "../../state/actions/user"
import {BASE_API_URL} from "../../config/url"
import "../../CSS/chat.css"

import ChatIndexChat from "./ChatIndexChat"

type Props = {}

const ChatIndex: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const chats: chatroomType[] = useSelector((state: rootState) => state.chatrooms)
	const navigation = useNavigate()

	const [fixedChats, setFixedChats] = useState<chatroomType[]>([])

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigation("/users/sign_in")
		}
	}, [current_user])

	useEffect(() => {
		dispatch(getChatroom())
	}, [])

	return(
		<div className="chat-index-area">
			<div className="row">
				<div className="col-2">
					<div className="chat-index-sidebar">
						<Link to="/">
							<img src="http://localhost:8000/media/images/logo/chat.png"
								 className="chat-index-header-img"
							/>
						</Link>
						<Link to="/current_user">
							<img src="http://localhost:8000/media/images/logo/user.jpeg"
								 className="chat-index-header-img"
							/>
						</Link>
						<Link to="/start_group_chat">
							<img src="http://localhost:8000/media/images/logo/group_chat.png"
								 className="chat-index-header-img"
							/>
						</Link>
					</div>
				</div>
				<div className="col-10">
					<div className="chat-index-chat-inner">
						<h2>チャット一覧</h2>
						<hr />
						<div className="chat-index-chat-timeline">
							{chats.map((chat, index) => {
								return (
									<ChatIndexChat chat={chat} current_user={current_user} key={chat.id} />
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatIndex;