import React, {useEffect, useState} from "react"
import axios from "axios"
import {Link, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"

import {rootState} from "../../state/reducers"
import {createGroupChat} from "../../state/actions/chatroom"
import {initStartGroupChatUser, addStartGroupChatUser} from "../../state/actions/startGroupChatUser"
import {BASE_API_URL} from "../../config/url"

import "../../CSS/chat.css"

const StartGroupChat = () => {

	const dispatch = useDispatch()
	const startGroupChatUser = useSelector((state: rootState) => state.startGroupChatUser)
	const id_input: any = React.createRef<HTMLInputElement>()
	const navigate = useNavigate()

	const [userLength, setUserLength] = useState<number[]>([])

	useEffect(() => {
		dispatch(initStartGroupChatUser())
	}, [])

	const addGroupChatUser = () => {
		let id_input_html = id_input.current
		let id_input_value: number = parseInt(id_input_html.value)
		id_input_html.value = ""
		if (id_input_value != NaN) {
			dispatch(addStartGroupChatUser(id_input_value))
		}
	}

	const onChangeCheckBox = () => {
		let user_checkboxes = document.getElementsByClassName("start-group-chat-user-checkbox")
		let user_checked_array: number[] = []
		for(let i =0; i <user_checkboxes.length; i++) {
			let user_checkbox = user_checkboxes[i] as HTMLInputElement
			if (user_checkbox.checked) {
				user_checked_array.push(parseInt(user_checkbox.value))
			}
		}
		setUserLength(user_checked_array)
	}

	const onClickCreateGroupChat = () => {
		if (userLength.length == 0) {
			return
		} else {
			dispatch(createGroupChat(userLength))
			navigate("/")
		}
	}

	return(
		<div className="start-group-chat-area">
			<div className="row">
				<div className="col-4">
					<Link to="/">＜　トップに戻る</Link>
				</div>
				<div className="col-4">
				</div>
				<div className="col-4"
					 style={{textAlign:"right"}}
					 onClick={() => onClickCreateGroupChat()}
				>
					作成する　＞
				</div>
			</div>
			<hr />
			<div className="start-group-chat-header">
				<div className="start-group-chat-header-selected-people">
					選択中：{userLength.length}
				</div>
				<div className="start-group-chat-header-input-area">
					<input 	type="text"
							className="start-group-chat-header-input form-control"
							placeholder="IDで検索"
							ref={id_input}
					/>
					<button className="start-group-chat-header-button btn btn-primary"
							onClick={() => addGroupChatUser()}
					>
						追加
					</button>
				</div>
			</div>
			<div className="start-group-chat-user-area">
				{startGroupChatUser.users.map((user, index) => {
					return(
						<div>
							<input  type="checkbox"
									onChange={() => onChangeCheckBox()}
									key={index}
									value={user.id}
									className="start-group-chat-user-checkbox"
							/>
							<img src={user.image}
								 className="start-group-chat-user-row-image"
							/>
							{user.name}
							<hr style={{margin: "5px 0", opacity: ".1"}}/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default StartGroupChat;