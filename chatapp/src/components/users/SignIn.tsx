import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import {useDispatch, useSelector} from "react-redux"
import {userSignIn, getCurrentUser} from "../../state/actions"
import {rootState} from "../../state/reducers"
import "../../CSS/userAuth.css"

type Props = {}

const SignIn: React.FC<Props> = () => {

	const dispatch = useDispatch()
	const current_user = useSelector((state: rootState) => state.sessions)
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user != 0 && current_user != null) {
			navigate("/")
		}
		console.log(current_user)
	}, [current_user])

	const login = (): void => {
		let email_html = document.getElementsByClassName("email-input")[0] as HTMLInputElement
		let password_html = document.getElementsByClassName("password-input")[0] as HTMLInputElement
		let email: string = email_html.value 
		let password: string = password_html.value
		dispatch(userSignIn(email, password))
	}

	return(
		<div className="signin-card">
			<h3>Line クローン ログイン</h3>
			<label>Email</label>
			<input  type="text"
					className="form-control email-input"
			/>
			<label>Password</label>
			<input  type="password"
					className="form-control password-input"
			/>
			<button className="btn btn-success"
					onClick={() => login()}>
					ログインする
			</button>
			<br/>
			<Link to="/users/sign_up">登録する</Link>
		</div>
	)
}

export default SignIn;