import React, {useEffect, useState} from "react"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {useParams, useNavigate} from "react-router-dom"
import {Link} from "react-router-dom"

import {getCurrentUser} from "../../state/actions"
import {chatroomType} from "../../state/actions/chatroom"
import {userType} from "../../state/actions/user"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"
import "../../CSS/chat.css"

const GroupChat = () => {

	const params = useParams<"chatId">();
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)

	const input_html: any = React.createRef<HTMLInputElement>()
	const [inputValue, setInputValue] = useState<string>("")
	const [chatroom, setChatroom] = useState<chatroomType>({})
	const [chatroomUsers, setChatRommUsers] = useState<userType[]>([])
	const [fixedChatroomUsers, setFixedChatroomUsers] = useState<userType[]>([])
	const [userIds, setUserIds] = useState<number[]>([])

	useEffect(() => {
		getChatData(Number(params.chatId))
	}, [])

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
	}, [current_user])

	useEffect(() => {
		searchUserName()
	}, [inputValue])

	const getChatData = (chat_id: number) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chat_id,
			method: "GET",
			withCredentials: true
		}).then((response) => {
			setChatroom(response.data)
			if (response.data.is_group == false) {
				navigate("/")
			}
			axios({
				url: BASE_API_URL + "/chatrooms/" + chat_id + "/users",
				method: "GET",
				withCredentials: true
			}).then((response2) => {
				setChatRommUsers(response2.data.users)
				setFixedChatroomUsers(response2.data.users)
				let user_ids: number[] = response2.data.users.map((user: userType) => user.id)
				setUserIds(user_ids)
				// if (user_ids.includes(current_user) == false) {
				// 	navigate("/")
				// }
			})
		})
	}

	const searchUserName = () => {
		console.log(inputValue)
		let fixed_chatroom_user = chatroomUsers.filter((item) => item.name != undefined ?
																	item.name.includes(inputValue)
																 :
																	false)
		setFixedChatroomUsers(fixed_chatroom_user)
	}

	const getInputData = () => {
		let input_value = input_html.current.value
		setInputValue(input_value)
	}

	const participateGroupChat = () => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token = response.data.csrf_token
			let data = new URLSearchParams()
			data.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/chatrooms/" + params.chatId + "/add_user",
				method: "POST",
				data: data,
				withCredentials: true
			}).then((response2) => {
				navigate("/chats/" + params.chatId)
			})
		})
	}

	return(
		<>
			<div className="group-chat-edit-tab">
				<Link to="/" className="group-chat-edit-tab-link">
					トップに戻る
				</Link>
			</div>
			<div className="group-chat-edit-header">
				<div className="row">
					<div className="col-3">
						<img src={chatroom.image}
							 className="group-chat-edit-header-img"
						/>
					</div>
					<div className="col-9 group-chat-edit-header-right">
						<Link to={"/chats/"+chatroom.id} className="group-chat-edit-header-name">
							{chatroom.name}
						</Link>
						<Link to={"/group_chats/"+chatroom.id+"/edit"} className="btn btn-sm btn-success">
							編集する
						</Link>
					</div>
				</div>
			</div>
			<div className="group-chat-edit-area">
				<input  type="text"
						className="form-control"
						placeholder="名前をフィルタ"
						ref={input_html}
						onChange={getInputData}
				/>
				{ userIds.includes(current_user) == false &&
					<div className="group-chat-edit-participate-button">
						<button className="btn btn-primary"
								onClick={() => participateGroupChat()}>
							参加する
						</button>
					</div>
				}
				<hr />
				{fixedChatroomUsers.map((user) => {
					return(
						<div className="group-chat-edit-user-box">
							<Link to={"/users/" + user.id}>
								<img src={user.image}
								 	 className="group-chat-edit-user-img"/>
							</Link>
							<span className="group-chat-edit-user-name">
								{user.name}
							</span>
						</div>
					)
				})}
			</div>
		</>
	)
}

export default GroupChat;