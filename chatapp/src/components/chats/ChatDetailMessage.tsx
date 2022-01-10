import React, {useEffect, useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"

import {BASE_API_URL} from "../../config/url"
import {userType} from "../../state/actions/user"
import {messageType} from "../../state/actions/message"

type Props = {
	message: messageType
	current_user: number
}

const ChatDetailMessage: React.FC<Props> = ({message, current_user}) => {

	const [userImage, setUserImage] = useState<string>()

	useEffect(() => {
		// setTimeout(getUserData, 500)
		getUserData()
	}, [])

	const getUserData = () => {
		let user_id: number = message.user_id
		axios({
			url: BASE_API_URL + "/users/" + user_id.toString(),
			method: "GET"
		}).then((response) => {
			let user: userType = response.data
			setUserImage(user.image)
		})
	}

	return(
		message.user_id == current_user ?
		<div className="row chat-detail-message-content">
			<div className="col-11">
				{ message.image ?
					<img src={message.image} className="chat-detail-message-myself-img"/>
				:
					<div className="chat-detail-message-myself">
						{message.content}
					</div>
				}
			</div>
			<div className="col-1">
				<Link to={"/users/"+message.user_id.toString()}>
					<img className="chat-detail-user-img myself-img" src={userImage} />
				</Link>
			</div>
		</div>
		:
		<div className="row">
			<div className="col-1">
				<Link to={"/users/"+message.user_id.toString()}>
					<img className="chat-detail-user-img" src={userImage} />
				</Link>
			</div>
			<div className="col-11">
				{ message.image ?
					<img src={message.image} className="chat-detail-message-others-img" />
				:
					<div className="chat-detail-message-others">
						{message.content}
					</div>
				}
			</div>
		</div>
	)
}

export default ChatDetailMessage;