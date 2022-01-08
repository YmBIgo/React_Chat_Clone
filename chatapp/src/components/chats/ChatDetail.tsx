import React, {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useParams, useNavigate, Link} from "react-router-dom"
import axios from "axios"

import ChatDetailMessage from "./ChatDetailMessage"
import {getCurrentUser} from "../../state/actions"
import {getMessages, addMessage, concatMessage, messageType} from "../../state/actions/message"
import {messageReducerType} from "../../state/reducers/messages"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"

type Props = {}

const ChatDetail: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const messages_: messageReducerType = useSelector((state: rootState) => state.messages)
	const messages: messageType[] = messages_.messages
	const messages_status: string = messages_.status
	const params = useParams<"chatId">();
	const navigate = useNavigate()

	const [fixedMessage, setFixedMessage] = useState<messageType[]>([])
	// 
	const last_section_pos = useRef(0)
	const next_section_pos = useRef(0)
	const offset = useRef(1)
	const is_scrolled = useRef(false)

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
	}, [current_user])

	useEffect(() => {
		if (messages_status === "fail"){
			navigate("/")
		}
		dispatch(getMessages(Number(params.chatId)))
	}, [messages_status])

	useEffect(() => {
		getChatData(Number(params.chatId))
		setTimeout(getMessageHeight, 100)
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

	const onClickConcatMessage = () => {
		dispatch(concatMessage(Number(params.chatId), offset.current))
		offset.current = offset.current + 1
	}

	const onScrollgetMessageHeight = (e: any) => {
		let target_position = e.target
		let scroll_position = target_position.scrollTop
		if ( scroll_position > 20 && is_scrolled.current == true ) {
			is_scrolled.current = false
		}
		// let client_position = target_position.clientHeight
		// let client_bottom = scroll_position + client_position + last_section_pos.current
		if (scroll_position < 20 && is_scrolled.current == false) {
			e.target.removeEventListener("scroll", onScrollgetMessageHeight)
			dispatch(concatMessage(Number(params.chatId), offset.current))
			offset.current = offset.current + 1
			is_scrolled.current = true
			e.target.addEventListener("scroll", onScrollgetMessageHeight)
			// 
			// e.target.scrollTo(0, 500)
		}
	}

	const getMessageHeight = (): void => {
		let next_section = document.getElementsByClassName("message-next-section")[0] as HTMLDivElement
		let last_section = document.getElementsByClassName("message-last-section")[0] as HTMLDivElement
		let next_section_position = next_section.getBoundingClientRect()
		let last_section_position = last_section.getBoundingClientRect()
		let scroll_section = document.getElementsByClassName("chat-detail-messages-area")[0] as HTMLDivElement
		scroll_section.scrollTo(0, last_section_position.top)
		scroll_section.addEventListener("scroll", onScrollgetMessageHeight)
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
				<div className="message-next-section">
				</div>
				<button onClick={() => onClickConcatMessage()}>もっと見る</button>
				<div className="chat-detail-message-not-found">
					表示できるメッセージはありません。
				</div>
				{messages.map((message, index) => {
					{ /*getUserData(message.user_id, index)*/ }
					return(
						<ChatDetailMessage message={message} current_user={current_user} />
					)
				})}
				<div className="message-last-section">
				</div>
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