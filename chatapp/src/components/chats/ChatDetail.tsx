import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useParams, useNavigate, Link} from "react-router-dom"
import axios from "axios"

import {getCurrentUser} from "../../state/actions"
import {getMessages, addMessage, messageType} from "../../state/actions/message"
import {messageReducerType} from "../../state/reducers/messages"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"

type Props = {}

const ChatDetail: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number = useSelector((state: rootState) => state.sessions)
	const messages_: messageReducerType = useSelector((state: rootState) => state.messages)
	const messages: messageType[] = messages_.messages
	const messages_status: string = messages_.status
	const params = useParams<"chatId">();
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getCurrentUser())
		// if (current_user === 0) {
		// 	navigate("/users/sign_in")
		// }
	}, [current_user])

	useEffect(() => {
		if (messages_status === "fail"){
			navigate("/")
		}
		dispatch(getMessages(Number(params.chatId)))
	}, [messages_status])

	useEffect(() => {
		getChatData(Number(params.chatId))
	}, [params])

	const getChatData = (chat_id: number) => {
		axios({
			url: BASE_API_URL + "/chatrooms/" + chat_id.toString(),
			method: "GET",
			withCredentials: true
		}).then((response) => {
			if (response.data.is_group == true) {
				let chat_name = response.data.name
				let chat_image = response.data.image
				let chat_name_html = document.getElementsByClassName("chat-detail-header-name")[0] as HTMLSpanElement
				let chat_image_html = document.getElementsByClassName("chat-detail-header-img")[0] as HTMLImageElement
				chat_name_html.innerText = chat_name
				chat_image_html.setAttribute("src", chat_image)
			} else if (response.data.is_group == false) {
				axios({
					url: BASE_API_URL + "/chatrooms/" + chat_id.toString() + "/single_user",
					method: "GET",
					withCredentials: true
				}).then((response2) => {
					let chat_name = response2.data.user.name
					let chat_image = response2.data.user.image
					let chat_name_html = document.getElementsByClassName("chat-detail-header-name")[0] as HTMLSpanElement
					let chat_image_html = document.getElementsByClassName("chat-detail-header-img")[0] as HTMLImageElement
					chat_name_html.innerText = chat_name
					chat_image_html.setAttribute("src", chat_image)
				})
			}
		})
	}

	const getUserData_ = async (user_id: number) => {
		try {
			let response = await axios({
				url: BASE_API_URL + "/users/" + user_id.toString(),
				method: "GET"
			})
			let user = response["data"]
			return user
		} catch(error) {
			console.log(error)
		}
	}

	const getUserData = async (user_id: number, index: number) => {
		let user = await getUserData_(user_id)
		let image_html = document.getElementsByClassName("chat-detail-user-img")[index] as HTMLImageElement
		image_html.setAttribute("src", user.image)
	}

	const sendMessage = () => {
		let text_input_html = document.getElementsByClassName("chat-detail-text-input")[0] as HTMLInputElement
		let image_input_html = document.getElementsByClassName("chat-detail-image-input")[0] as HTMLInputElement
		let text_input: string = text_input_html.value
		if (image_input_html.files !== null) {
			if (image_input_html.files.length != 0){
				let image_input_file = image_input_html.files[0]
				dispatch(addMessage(text_input, image_input_html.files[0], Number(params.chatId)))
			} else {
				dispatch(addMessage(text_input, "", Number(params.chatId)))
			}
		} else {
			dispatch(addMessage(text_input, "", Number(params.chatId)))
		}
		text_input_html.value = ""
		image_input_html.value = ""
	}

	return(
		<div className="chat-detail-area">
			<Link to="/">＜　トップに戻る</Link>
			<div className="chat-detail-header">
				<div className="row">
					<div className="col-2">
						<img className="chat-detail-header-img" />
					</div>
					<div className="col-10">
						<span className="chat-detail-header-name">
						</span>
					</div>
				</div>
			</div>
			<div className="chat-detail-messages-area">
				{messages.map((message, index) => {
					{getUserData(message.user_id, index)}
					return message.user_id == current_user ?	
						message.image == "" ?
							<div className="row chat-detail-message-content">
								<div className="col-11">
									<div className="chat-detail-message-myself">
										{message.content}
									</div>
								</div>
								<div className="col-1">
									<img className="chat-detail-user-img myself-img" />
								</div>
							</div>
						:
							<div className="row chat-detail-message-content">
								<div className="col-11">
									<img src={message.image} className="chat-detail-message-myself-img"/>
								</div>
								<div className="col-1">
									<img className="chat-detail-user-img myself-img" />
								</div>
							</div>
					:
						message.image == "" ?
							<div className="row">
								<div className="col-1">
									<img className="chat-detail-user-img" />
								</div>
								<div className="col-11">
									<div className="chat-detail-message-others">
										{message.content}
									</div>
								</div>
							</div>
						:
							<div className="row">
								<div className="col-1">
									<img className="chat-detail-user-img" />
								</div>
								<div className="col-11">
									<img src={message.image} className="chat-detail-message-others-img" />
								</div>
							</div>
				})}
			</div>
			<div className="chat-detail-form-area">
				<input type="text" name="content" className="form-control chat-detail-text-input" />
				<input type="file" accept="image/*" className="chat-detail-image-input" />
				<button className="btn btn-primary"
						onClick={() => sendMessage()}		
				>
					送信する
				</button>
			</div>
		</div>
	)
}

export default ChatDetail;