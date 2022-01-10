import React, {useEffect, useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import {useParams, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"

import {getCurrentUser} from "../../state/actions"
import {chatroomType} from "../../state/actions/chatroom"
import {userType} from "../../state/actions/user"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"
import "../../CSS/chat.css"

const GroupChatEdit = () => {

	const [chatroom, setChatroom] = useState<chatroomType>({})
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const image_input_ref: any = React.createRef<HTMLInputElement>()
	const name_input_ref: any = React.createRef<HTMLInputElement>()

	const dispatch = useDispatch()
	const params = useParams<"chatId">();
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
	}, [current_user])

	useEffect(() => {
		getChatData(Number(params.chatId))
	}, [])

	useEffect(() => {
		name_input_ref.current.value = chatroom.name
	}, [chatroom])

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
				let user_ids: number[] = response2.data.users.map((user: userType) => user.id)
				if (user_ids.includes(current_user) == false) {
					navigate("/")
				}
			})
		})
	}

	const updateGroupChat = () => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token = response.data.csrf_token
			let name = name_input_ref.current.value
			let data = new URLSearchParams()
			data.append("csrf_token", csrf_token)
			data.append("name", name)
			axios({
				url: BASE_API_URL + "/chatrooms/" + params.chatId,
				method: "POST",
				data: data,
				withCredentials: true
			}).then((response2) => {
				navigate("/chats/"+params.chatId)
			})
		})
	}

	const updateGroupChatImage = () => {
		let images = image_input_ref.current.files
		if (images !== null) {
			if (images.length > 0) {
				axios({
					url: BASE_API_URL + "/generate_csrf",
					method: "GET"
				}).then((response) => {
					let csrf_token = response.data.csrf_token
					let data = new FormData()
					data.append("csrf_token", csrf_token)
					data.append("image", images[0])
					axios({
						url: BASE_API_URL + "/chatrooms/" + params.chatId + "/upload_image",
						method: "POST",
						data: data,
						withCredentials: true
					}).then((response2) => {
						navigate("/")
					})
				})
			} else {
				//
			}
		}
	}

	const quitGroupChat = () => {
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token = response.data.csrf_token
			let data = new URLSearchParams()
			data.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/chatrooms/" + params.chatId + "/remove_user",
				method: "POST",
				data: data,
				withCredentials: true
			}).then((response2) => {
				navigate("/")
			})
		})
	}

	return(
		<div className="group-chat-update-area">
			<Link to="/">
				トップに戻る
			</Link>
			<hr />
			<h3 className="">{chatroom.name}</h3>
			<hr />
			<h4>画像をアップロード</h4>
			<div className="row">
				<div className="col-6">
					<label>Image</label>
					<input 	type="file"
							name="image"
							ref={image_input_ref}
					/>
					<button className="btn btn-primary group-chat-update-input-btn"
							onClick={() => updateGroupChatImage()}>
						送信する
					</button>
				</div>
				<div className="col-6">
					<img src={chatroom.image}
						 className="group-chat-update-input-image"
					/>
				</div>
			</div>
			<hr />
			<h4>タイトルを編集</h4>
			<label>Name</label>
			<br />
			<input 	type="text"
					name="name"
					className="form-control"
					ref={name_input_ref}
			/>
			<button className="btn btn-primary group-chat-update-input-btn"
					onClick={() => updateGroupChat()}
			>
				送信する
			</button>
			<hr />
			<h4>グループチャットを退会する</h4>
			<button className="btn btn-danger"
					onClick={() => quitGroupChat()}>
				退会する
			</button>
		</div>
	)
}

export default GroupChatEdit;