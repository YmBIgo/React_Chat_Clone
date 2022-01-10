import React, {useEffect, useState} from "react"
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate, Link} from "react-router-dom"

import {getCurrentUser} from "../../state/actions"
import {userType} from "../../state/actions/user"
import {rootState} from "../../state/reducers"
import {BASE_API_URL} from "../../config/url"
import "../../CSS/user.css"

const CurrentUserEdit = () => {

	const dispatch = useDispatch()
	const current_user: number | null = useSelector((state: rootState) => state.sessions)
	const navigate = useNavigate()

	// any 型...
	const file_input: any = React.createRef<HTMLInputElement>()
	const name_input: any = React.createRef<HTMLInputElement>()
	const first_name_input: any = React.createRef<HTMLInputElement>()
	const last_name_input: any = React.createRef<HTMLInputElement>()
	const description_input: any = React.createRef<HTMLInputElement>()
	const file_error: any = React.createRef<HTMLDivElement>()

	const [user, setUser] = useState<userType>({})

	useEffect(() => {
		dispatch(getCurrentUser())
		if (current_user === 0) {
			navigate("/users/sign_in")
		}
		getCurrentUserData()
	}, [current_user])

	useEffect(() => {
		fillCurrentUserData()
	}, [user])

	const getCurrentUserData = async () => {
		let result = await axios({
			url: BASE_API_URL + "/current_user",
			method: "GET",
			withCredentials: true
		})
		setUser(result.data.user)
	}

	const fillCurrentUserData = () => {
		name_input.current.value = user.name
		first_name_input.current.value = user.first_name
		last_name_input.current.value = user.last_name
		description_input.current.value = user.description
	}

	const updateUserImage = () => {
		let images = file_input.current.files
		if (images !== null) {
			if (images.length > 0) {
				file_error.current.style.display = "none"
				axios({
					url: BASE_API_URL + "/generate_csrf",
					method: "GET"
				}).then((response) => {
					let csrf_token: string = response["data"]["csrf_token"]
					let params = new FormData()
					params.append("csrf_token", csrf_token)
					params.append("image", images[0])
					axios({
						url: BASE_API_URL + "/users/upload_image",
						method: "POST",
						data: params,
						withCredentials: true
					}).then((response2) => {
						navigate("/")
					})
				})
			} else {
				file_error.current.style.display = "block"
			}
		}
	}

	const updateUser = (): void => {
		let name: string = name_input.current.value
		let first_name: string = first_name_input.current.value
		let last_name: string = last_name_input.current.value
		let description: string = description_input.current.value
		axios({
			url: BASE_API_URL + "/generate_csrf",
			method: "GET"
		}).then((response) => {
			let csrf_token: string = response["data"]["csrf_token"]
			let params = new URLSearchParams()
			params.append("name", name)
			params.append("first_name", first_name)
			params.append("last_name", last_name)
			params.append("description", description)
			params.append("csrf_token", csrf_token)
			axios({
				url: BASE_API_URL + "/users/update",
				method: "POST",
				data: params,
				withCredentials: true
			}).then((response2) => {
				navigate("/")
			})
		})
	}

	return (
		<div className="current-user-edit-area">
			<div className="current-user-edit-area-inner">
				<Link to="/">＜ トップに戻る</Link>
				<hr />
				<h3>ユーザー編集</h3>
				<hr />
				<div ref={file_error} style={{color:"red", marginLeft: "20px", display: "none"}}>
					file error
				</div>
				<div className="row">
					<div className="col-6">
						<label className="current-user-edit-label">
							Image
						</label>
						<br />
						<input 	type="file"
								accept="image/*"
								ref={file_input}
						/>
						<br />
						<input  type="button"
								className="btn btn-primary current-user-edit-btn"
								value="送信する"
								onClick={() => updateUserImage()}
						/>
					</div>
					<div className="col-6">
						<img src={user.image} className="current-user-edit-img" />
					</div>
				</div>
				<hr />
				<label className="current-user-edit-label">
					Name
				</label>
				<input  type="text"
						className="form-control current-user-edit-input"
						ref={name_input}
				/>
				<label className="current-user-edit-label">
					FirstName
				</label>
				<input  type="text"
						className="form-control current-user-edit-input"
						ref={first_name_input}
				/>
				<label className="current-user-edit-label">
					LastName
				</label>
				<input  type="text"
						className="form-control current-user-edit-input"
						ref={last_name_input}
				/>
				<label className="current-user-edit-label">
					Description
				</label>
				<input  type="text"
						className="form-control current-user-edit-input"
						ref={description_input}
				/>
				<input  type="button"
						className="btn btn-primary current-user-edit-btn"
						value="送信する"
						onClick={() => updateUser()}
				/>
			</div>
		</div>
	)
}

export default CurrentUserEdit;