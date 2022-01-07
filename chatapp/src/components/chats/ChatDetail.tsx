import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useParams} from "react-router-dom"

import {getCurrentUser} from "../../state/actions"
import {getMessages, messageType} from "../../state/actions/message"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"

type Props = {}

const ChatDetail: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number = useSelector((state: rootState) => state.sessions)
	const messages: messageType[] = useSelector((state: rootState) => state.messages)
	const params = useParams<"chatId">();

	useEffect(() => {
		dispatch(getCurrentUser())
		dispatch(getMessages(Number(params.chatId)))
	}, [])

	return(
		<div className="chat-detail-area">
			<div className="chat-detail-messages-area">
				{messages.map((message) => {
					return message.user_id == current_user ?	
						message.image == "" ?
							<div className="chat-detail-message-myself">
								{message.content}
							</div>
						:
							<div>
								<img src={message.image} className="chat-detail-message-myself-img"/>
							</div>
					:
						message.image == "" ?
							<div className="chat-detail-message-others">
								{message.content}
							</div>
						:
							<div>
								<img src={message.image} className="chat-detail-message-others-img" />
							</div>
				})}
			</div>
		</div>
	)
}

export default ChatDetail;