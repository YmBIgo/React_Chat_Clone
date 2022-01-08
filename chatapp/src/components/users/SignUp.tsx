import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux"
import {userSignUp, getCurrentUser} from "../../state/actions"
import {rootState} from "../../state/reducers"
import "../../CSS/userAuth.css"

type Props = {}

const SignUp: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user != 0 && current_user != null) {
			navigate("/")
		}
		console.log(current_user)
	}, [current_user])

	const signup = (): void => {
		let email_html = document.getElementsByClassName("email-input")[0] as HTMLInputElement
		let password_html = document.getElementsByClassName("password-input")[0] as HTMLInputElement
		let name_html = document.getElementsByClassName("name-input")[0] as HTMLInputElement
		let email: string = email_html.value 
		let password: string = password_html.value
		let user_name: string = name_html.value
		dispatch(userSignUp(email, password, user_name))
	}

	return(
		<div className="signin-card">
			<h3>Line クローン 登録</h3>
			<label>User Name</label>
			<input  type="text"
					className="form-control name-input"
			/>
			<label>Email</label>
			<input  type="text"
					className="form-control email-input"
			/>
			<label>Password</label>
			<input  type="text"
					className="form-control password-input"
			/>
			<button className="btn btn-success"
					onClick={() => signup()}
			>
				登録する
			</button>
			<br/>
			<Link to="/users/sign_in">ログインする</Link>
		</div>
	)
}

export default SignUp;