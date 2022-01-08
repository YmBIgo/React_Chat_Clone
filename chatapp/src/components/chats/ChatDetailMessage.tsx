import React, {useEffect} from "react"
import axios from "axios"
import {Link} from "react-router-dom"

import {BASE_API_URL} from "../../config/url"
import {messageType} from "../../state/actions/message"

type Props = {
	message: messageType
	current_user: number
}

const ChatDetailMessage: React.FC<Props> = ({message, current_user}) => {

	useEffect(() => {
		getUserData(message.user_id)
	}, [])

	let image_ref = React.createRef<HTMLImageElement>()

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

	const getUserData = async (user_id: number) => {
		// let user = await getUserData_(user_id)
		getUserData_(user_id).then((user) => {
			let image_html = image_ref.current as HTMLImageElement
			// let image_html = document.getElementsByClassName("chat-detail-user-img")[index] as HTMLImageElement
			image_html.setAttribute("src", user.image)
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
					<img className="chat-detail-user-img myself-img" ref={image_ref} />
				</Link>
			</div>
		</div>
		:
		<div className="row">
			<div className="col-1">
				<Link to={"/users/"+message.user_id.toString()}>
					<img className="chat-detail-user-img" ref={image_ref} />
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