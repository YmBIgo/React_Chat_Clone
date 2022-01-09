import React, {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate, Link} from "react-router-dom"

import {getCurrentUser} from "../../state/actions"
import {rootState} from "../../state/reducers"
import "../../CSS/user.css"

const CurrentUserEdit = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
	}, [current_user])

	return (
		<div className="current-user-edit-area">
		</div>
	)
}

export default CurrentUserEdit;