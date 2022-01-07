import json
import uuid
import hashlib
import datetime

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .models import User, ChatRoom, ChatRoomUserRelation, Message, CsrfToken

# Create your views here.

# 1 : Login関係
# 2 : User関係
# 3 : ChatRoom 関係
# 4 : ChatRoomUserRelation 関係
# 
# 6 : 共有

# 1 : Login 関係
def userCreate(request):
	check_user_signed_in = checkUserSignedIn(request)
	if (check_user_signed_in != False):
		response = {"status": "fail",
					"message": "you have already signed in."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		user_name = request.POST.get("user_name")
		email = request.POST.get("email")
		password = request.POST.get("password")
		# チェック
		# 	1 : user_name, email, password の内容が、n文字以上ある
		if (len(user_name)<0 or len(email)<6 or len(password)<7 ):
			response = {"status": "fail",
						"message": "content too short"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		else:
			try:
				cookie_text = str(uuid.uuid4()).replace("-", "")
				hashed_password = hashlib.md5(password.encode('utf-8')).hexdigest()
				user = User.objects.create(name=user_name, email=email, password=hashed_password, cookie=cookie_text)
				response = {"status": "success",
							"message": "ok",
							"userId": user.id}
				result = json.dumps(response, ensure_ascii=False)
				http_response = HttpResponse(result)
				set_cookie(http_response, "chat_user_cookie", cookie_text, 365*24*60*60)
				set_cookie(http_response, "chat_user_email", email, 365*24*60*60)
				return http_response
			except:
				response = {"status": "error",
							"message": "some thing went wrong."}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
		return HttpResponse(user_name)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def userSignIn(request):
	check_user_signed_in = checkUserSignedIn(request)
	if (check_user_signed_in != False):
		response = {"status": "fail",
					"message": "you have already signed in."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		email = request.POST.get("email")
		password = request.POST.get("password")
		hashed_password = hashlib.md5(password.encode('utf-8')).hexdigest()
		try:
			user = User.objects.filter(email=email, password=hashed_password)
			if (len(user) > 0):
				cookie_text = str(uuid.uuid4()).replace("-", "")
				user.update(cookie=cookie_text)
				user_json = {"id": user[0].id, "name": user[0].name, "email": user[0].email}
				response = {"status": "success",
							"message": "ok",
							"user": user_json}
				result = json.dumps(response, ensure_ascii=False)
				http_response = HttpResponse(result)
				set_cookie(http_response, "chat_user_cookie", cookie_text, 365*24*60*60)
				set_cookie(http_response, "chat_user_email", email, 365*24*60*60)
				return http_response
			else:
				response = {"status": "fail",
							"message": "user authorization fail"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
		except Exception as e:
			print(e)
			response = {"status": "error",
						"message": "some thing went wrong."}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def updateUser(request):
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		user = current_user
		first_name = request.POST.get("first_name")
		last_name = request.POST.get("last_name")
		description = request.POST.get("description")
		# image = request.POST.get("image")
		user.update(first_name=first_name, last_name=last_name, description=description)
		response = {"status": "success",
					"message": "ok"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def uploadImageUser(request):
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST" and "image" in request.FILES.keys():
		# csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		my_user = current_user[0]
		image = request.FILES["image"]
		fs = FileSystemStorage()
		file_path = "users/" + my_user.name + "/" + str(uuid.uuid4()).replace("-", "")[:10] + "_" + image.name
		print(file_path)
		file_name = fs.save(file_path, image)
		# GCP も 使えれば 使いたい。
		BASE_DIR = getattr(settings, "BASE_DIR", None)
		media_path = str(BASE_DIR) + fs.url(file_name)
		# 
		uploaded_file_url = "http://localhost:8000" + fs.url(file_name)
		current_user.update(image=uploaded_file_url)
		# Redirect をどうするか？
		return HttpResponse(uploaded_file_url)
	else:
		response = {"status": "fail",
					"message": "not providing POST request or Image."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def currentUser(request):
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	else:
		user = current_user[0]
		current_user_json = {"id": user.id, "name": user.name,
							 "first_name": user.first_name, "last_name": user.last_name,
							 "description": user.description, "image": str(user.image),
							 "created_at": str(user.created_at)}
		response = {"status": "success",
					"message": "ok",
					"user": current_user_json}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def generateCsrfToken(request):
	csrf_token = str(uuid.uuid4()).replace("-", "")
	CsrfToken.objects.create(content=csrf_token)
	response = {"status": "success",
				"csrf_token": csrf_token}
	result = json.dumps(response, ensure_ascii=False)
	return HttpResponse(result)

# 2 : User 関係

def showUser(request, id):
	if request.method == "GET":
		try:
			user = User.objects.get(pk=id)
			response = {"id": user.id, "name": user.name,
						"first_name": user.first_name, "last_name": user.last_name,
						"description": user.description, "image": user.image.name,
						"created_at": str(user.created_at)}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		except:
			response = {"status": "error",
						"message": "some thing went wrong."}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing GET request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

# 3 : ChatRoom 関係

def createChatroom(request):
	# 
	# [Input]	user_id
	# [Output]	1 : success
	# 				> register ChatRoom & ChatRoomUserRelation
	# 			2 : success (duplicate chatroom)
	# 			3 : fail (user_id 404)
	# 			4 : fail (user_id is currentuser id)
	# 			5 : fail (CSRF check)
	# 			6 : fail (User not signed in)
	# 

	# Check 6
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# Check 5 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 4
		my_user = current_user[0]
		other_user_id = int(request.POST.get("user_id"))
		if (other_user_id == my_user.id):
			response = {"status": "error",
						"message": "can not generate chatroom."}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 2
		chatroom_string = "[" + str(my_user.id) + ", " + request.POST.get("user_id") + "]"
		is_chatroom_exist = ChatRoom.objects.filter(is_group=False, user_ids=chatroom_string)
		if len(is_chatroom_exist) > 0:
			chatroom = is_chatroom_exist[0]
			response = {"status": "success",
						"message": "chat room already exists",
						"chatroom": {"id":chatroom.id, "name":chatroom.name, "is_group": chatroom.is_group}}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		try:
			# Check 3
			other_user = User.objects.get(pk=other_user_id)
			chatroom_name = my_user.name + "と" + other_user.name + "のチャット"
			chatroom = ChatRoom.objects.create(name=chatroom_name, user_ids=chatroom_string, is_group=False)
			ChatRoomUserRelation.objects.create(chat_room=chatroom, user=my_user, is_group=False)
			ChatRoomUserRelation.objects.create(chat_room=chatroom, user=other_user, is_group=False)
			response = {"status": "success",
						"message": "ok",
						"chatroom": {"id": chatroom.id, "name": chatroom.name, "is_group": chatroom.is_group}}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		except:
			response = {"status": "error",
						"message": "some thing went wrong."}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def createGroupChatroom(request):
	# [Input]	Array[user_id]
	# [Output]	1 : success
	# 				> register ChatRoom & ChatRoomUserRelation
	# 			2 : current user not exist
	# 			3 : fail (user_id 404)
	# 			4 : fail (CSRF check)
	# 			5 : fail (User not signed in)
	# 

	# Check 5
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# Check 4 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 3
		users_id_str = request.POST.get("user_ids")
		users_array = []
		try:
			users_id = json.loads(users_id_str)
			users_id.append(current_user[0].id)
			users_id_str = json.dumps(users_id)
			for user_id in users_id:
				user = User.objects.get(pk=user_id)
				users_array.append(user)
		except:
			response = {"status": "fail",
						"message": "user not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 1
		chatroom = ChatRoom.objects.create(name="新規チャット", is_group=True, user_ids=users_id_str)
		for user in users_array:
			ChatRoomUserRelation.objects.create(user=user, chat_room=chatroom, is_group=True)
		response = {"status": "success",
					"message": "ok",
					"chatroom": {"id": chatroom.id, "name": chatroom.name,
								 "is_group": chatroom.is_group, "image": str(chatroom.image)}
					}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def showChatroom(request, id):
	# Check 5
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# [Input]	chatroom_id
		# [Output]	1 : success
		# 				> update chatroom
		# 			2 : fail (chatroom not relate to user)
		# 			3 : fail (chatroom_id 404)
		# 			4 : fail (CSRF check)
		# 			5 : fail (User not signed in)

		# Check 4 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 3
		chatroom_filtered = ChatRoom.objects.filter(pk=id)
		if len(chatroom_filtered) > 0:
			# Check 2
			chatroom = chatroom_filtered[0]
			is_chatroom_related = ChatRoomUserRelation.objects.filter(user=current_user[0], chat_room=chatroom, is_group=chatroom.is_group)
			if len(is_chatroom_related) > 0:
				chat_name = request.POST.get("name")
				chatroom_filtered.update(name=chat_name)
				response = {"status": "success",
							"message": "ok",
							"chatroom":{"id": chatroom.id, "name": chat_name,
										"is_group": chatroom.is_group, "image": str(chatroom.image)}
							}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			else:
				response = {"status": "fail",
							"message": "chat room not related to currentuser"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
		else:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)

	elif request.method == "GET":
		# [Input]	chatroom_id
		# [Output]	1 : success
		# 				> display chatroom
		# 			2 : fail (chatroom not relate to user)
		# 			3 : fail (chatroom_id 404)
		# 			5 : fail (User not signed in)

		try:
			chatroom = ChatRoom.objects.get(pk=id)
			response = {"id": chatroom.id, "name": chatroom.name,
						"is_group": chatroom.is_group, "image": str(chatroom.image)}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		except:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def uploadImageChatroom(request, id):
	# [Input]	chatroom_id
	# [Output]	1 : success
	# 				> update chatroom
	# 			2 : fail (chatroom not relate to user)
	# 			3 : fail (chatroom_id 404)
	# 			4 : fail (CSRF check)
	# 			5 : fail (User not signed in)

	# Check 5
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST" and "image" in request.FILES.keys():
		# Check 4 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 3
		chatroom_filtered = ChatRoom.objects.filter(pk=id)
		if len(chatroom_filtered) > 0:
			# Check 2
			chatroom = chatroom_filtered[0]
			is_chatroom_related = ChatRoomUserRelation.objects.filter(user=current_user[0], chat_room=chatroom, is_group=chatroom.is_group)
			if len(is_chatroom_related) == 1:
				image = request.FILES["image"]
				fs = FileSystemStorage()
				file_path = "chatrooms/" + str(chatroom.id) + "/logo/" + str(uuid.uuid4()).replace("-", "")[:10] + "_" + image.name
				file_name = fs.save(file_path, image)
				uploaded_file_url = "http://localhost:8000" + fs.url(file_name)
				chatroom_filtered.update(image=uploaded_file_url)
				response = {"status": "success",
							"message": "ok",
							"image_url": uploaded_file_url}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			else:
				response = {"status": "fail",
							"message": "chat room not related to currentuser"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request and Image."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def showCurrentUsersChatroom(request):
	# [Input]	None
	# [Output]	1 : success
	# 				> display chatrooms user
	# 			2 : fail (User not signed in)

	# Check 2
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "GET":
		chatroom_relations = ChatRoomUserRelation.objects.filter(user=current_user[0])
		chatrooms_array = []
		for chatroom_relation in chatroom_relations:
			chatroom = chatroom_relation.chat_room
			chatroom_data = {"id": chatroom.id,
							 "name": chatroom.name, 
							 "is_group": chatroom.is_group,
							 "image": str(chatroom.image)}
			chatrooms_array.append(chatroom_data)
		response = {"status": "success",
					"message": "ok",
					"chatrooms": chatrooms_array}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing GET request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def showChatroomUsers(request, id):
	# [Input]	id
	# [Output]	1 : success
	# 				> display chatrooms user
	# 			2 : fail (chatroom_id 404)
	# 			3 : fail (User not signed in)
	# Check 3
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "GET":
		# Check 2
		chatroom = ChatRoom.objects.filter(pk=id)
		if len(chatroom) == 1:
			users_array = []
			chatroom_relations = ChatRoomUserRelation.objects.filter(chat_room=chatroom[0])
			for c_relation in chatroom_relations:
				user = c_relation.user
				user_data = {"id": user.id, "name": user.name,
							 "first_name": user.first_name,"last_name": user.last_name,
							 "description": user.description, "image": str(user.image),
							 "created_at": str(user.created_at)}
				users_array.append(user_data)
			response = {"status": "success",
						"message": "ok",
						"users": users_array}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		else:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing GET request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def showSingleChatroomUser(request, id):
	# [Input]	id
	# [Output]	1 : success
	# 				> display chatrooms user
	# 			2 : fail (chatroom_id 404)
	# 			3 : fail (User not signed in)

	# Check 3
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "GET":
		# Check 2
		chatroom = ChatRoom.objects.filter(pk=id, is_group=False)
		if len(chatroom) == 0:
			response = {"status": "fail",
						"message": "chatroom not found"}
			result = json.dumps(response)
			return HttpResponse(result)
		chatroom_user_relation = ChatRoomUserRelation.objects.filter(chat_room=chatroom[0])
		chat_user = {}
		chat_user_ids = []
		for chat_user in chatroom_user_relation:
			chat_user_ids.append(chat_user.user.id)
			if chat_user.user.id != current_user[0].id:
				chat_user = {"id":chat_user.user.id, "name": chat_user.user.name,
							 "first_name": chat_user.user.first_name, "last_name": chat_user.user.last_name,
							 "image": str(chat_user.user.image), "description": chat_user.user.description,
							 "created_at": str(chat_user.user.created_at)}
		print(chat_user_ids, current_user[0].id)
		if current_user[0].id in chat_user_ids:
			response = {"status": "success", "message": "ok",
						"user": chat_user}
			result = json.dumps(response)
			return HttpResponse(result)
		else:
			response = {"status": "fail",
						"message": "current user not exist in chat"}
			result = json.dumps(response)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing GET request."}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

# 4 : ChatRoomUserRelation 関係

def addUserToGroupChat(request, id):
	# [Input]	chat_id
	# [Output]	1 : success
	# 				> generate chatroomUserRelation
	# 			2 : fail (user_id is not duplicated)
	# 			3 : fail (chatroom is_group)
	# 			4 : fail (chatroom_id 404)
	# 			5 : fail (CSRF check)
	# 			6 : fail (User not signed in)

	# Check 6
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# Check 5 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 4
		chatroom_filtered = ChatRoom.objects.filter(pk=id)
		if len(chatroom_filtered) == 0:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 3
		chatroom = chatroom_filtered[0]
		if (chatroom.is_group == False):
			response = {"status": "fail",
						"message": "only group chat can add user"}
			result = json.dumps(response)
			return HttpResponse(result)
		# Check 2
		chatroom_relation = ChatRoomUserRelation.objects.filter(chat_room=chatroom, user=current_user[0], is_group=True)
		if len(chatroom_relation) > 0:
			response = {"status": "fail",
						"message": "user already exist in this chat"}
			result = json.dumps(response)
			return HttpResponse(result)
		# 1
		ChatRoomUserRelation.objects.create(chat_room=chatroom, user=current_user[0], is_group=True)
		users_array = []
		c_relations = ChatRoomUserRelation.objects.filter(chat_room=chatroom, is_group=True)
		for c_relation in c_relations:
			users_array.append(c_relation.user.id)
		users_array_str = json.dumps(users_array)
		chatroom_filtered.update(user_ids=users_array_str)
		# response
		response = {"status": "success",
					"message": "ok"}
		result = json.dumps(response)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def removeUserToGroupChat(request, id):
	# [Input]	chat_id
	# [Output]	1 : success
	# 				> generate chatroomUserRelation
	# 			2 : fail (user_id should already exist)
	# 			3 : fail (chatroom is_group)
	# 			4 : fail (chatroom_id 404)
	# 			5 : fail (CSRF check)
	# 			6 : fail (User not signed in)

	# Check 6
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# Check 5 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 4
		chatroom_filtered = ChatRoom.objects.filter(pk=id)
		if len(chatroom_filtered) == 0:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 3
		chatroom = chatroom_filtered[0]
		if (chatroom.is_group == False):
			response = {"status": "fail",
						"message": "only group chat can add user"}
			result = json.dumps(response)
			return HttpResponse(result)
		# Check 2
		chatroom_relation = ChatRoomUserRelation.objects.filter(chat_room=chatroom, user=current_user[0], is_group=True)
		if len(chatroom_relation) == 0:
			response = {"status": "fail",
						"message": "user is not exist in this chat"}
			result = json.dumps(response)
			return HttpResponse(result)
		# 1
		chatroom_relation.delete()
		users_array = []
		c_relations = ChatRoomUserRelation.objects.filter(chat_room=chatroom, is_group=True)
		for c_relation in c_relations:
			users_array.append(c_relation.user.id)
		users_array_str = json.dumps(users_array)
		chatroom_filtered.update(user_ids=users_array_str)
		# response
		response = {"status": "success",
					"message": "ok"}
		result = json.dumps(response)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST request"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

# 5 : Message 関係

def sendMessage(request, id):

	# Check 5
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "POST":
		# Check 4 csrf check 
		check_csrf = checkCsrfToken(request.POST.get("csrf_token"))
		if (check_csrf == False):
			response = {"status": "fail",
						"message": "csrf check fails"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		if "image" in request.FILES.keys():
			# [Input]	chat_id, image, (content)
			# [Output]	1 : success
			# 				> generate ImageMessage (TextMessage)
			# 			2 : fail (user_id should participate)
			# 			3 : fail (chatroom_id 404)
			# 			4 : fail (CSRF check)
			# 			5 : fail (User not signed in)

			# Check 3
			chatroom = ChatRoom.objects.filter(pk=id)
			if len(chatroom) == 0:
				response = {"status": "fail",
							"message": "chatroom not exist"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			# Check 2
			is_user_exist_in_chatroom = ChatRoomUserRelation.objects.filter(user=current_user[0],chat_room=chatroom[0])
			if len(is_user_exist_in_chatroom) == 0:
				response = {"status": "fail",
							"message": "user is not exist in this chat"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			# 1
			image = request.FILES["image"]
			fs = FileSystemStorage()
			file_path = "chatrooms/" + str(chatroom[0].id) + "/" + str(uuid.uuid4()).replace("-", "")[:10] + "_" + image.name
			file_name = fs.save(file_path, image)
			uploaded_file_url = "http://localhost:8000" + fs.url(file_name)
			message = Message.objects.create(user=current_user[0], chat_room=chatroom[0], image=uploaded_file_url)
			# 
			content = request.POST.get("content")
			if content != None and content != "":
				message = Message.objects.create(user=current_user[0], chat_room=chatroom[0], content=content)
			response = {"status": "success",
						"message": "ok"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		else:
			# [Input]	chat_id, content
			# [Output]	1 : success
			# 				> generate TextMessage
			# 			2 : fail (user_id should participate)
			# 			3 : fail (chatroom_id 404)
			# 			4 : fail (CSRF check)
			# 			5 : fail (User not signed in)

			# Check 3
			chatroom = ChatRoom.objects.filter(pk=id)
			if len(chatroom) == 0:
				response = {"status": "fail",
							"message": "chatroom not exist"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			# Check 2
			is_user_exist_in_chatroom = ChatRoomUserRelation.objects.filter(user=current_user[0],chat_room=chatroom[0])
			if len(is_user_exist_in_chatroom) == 0:
				response = {"status": "fail",
							"message": "user is not exist in this chat"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			# 1
			content = request.POST.get("content")
			if content == None or content == "":
				response = {"status": "fail",
							"message": "content should not blank"}
				result = json.dumps(response, ensure_ascii=False)
				return HttpResponse(result)
			message = Message.objects.create(user=current_user[0], chat_room=chatroom[0], content=content)
			response = {"status": "success",
						"message": "ok"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
	elif request.method == "GET":
		# [Input]	chat_id
		# [Output]	1 : success
		# 				> generate TextMessage
		# 			2 : fail (user_id should participate)
		# 			3 : fail (chatroom_id 404)
		# 			4 : fail (User not signed in)
		
		# Check 3
		chatroom = ChatRoom.objects.filter(pk=id)
		if len(chatroom) == 0:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 2
		is_user_exist_in_chatroom = ChatRoomUserRelation.objects.filter(user=current_user[0],chat_room=chatroom[0])
		if len(is_user_exist_in_chatroom) == 0:
			response = {"status": "fail",
						"message": "user is not exist in this chat"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# 1
		offset = request.GET.get("offset")
		if offset == None:
			offset = 0
		offset_start = offset * 10; offset_end = (offset+1) * 10
		messages = Message.objects.filter(chat_room=chatroom[0]).order_by('-created_at').all()[offset_start:offset_end]
		messages_json = []
		for message in messages:
			message_json = {"id": message.id, "content": message.content, "image": str(message.image)}
			messages_json.append(message_json)
		response = {"status": "success",
					"message": "ok",
					"messages": messages_json}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing POST or GET request"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

def lastMessage(request, id):
	# [Input]	chat_id
	# [Output]	1 : success
	# 				> generate TextMessage
	# 			2 : fail (user_id should participate)
	# 			3 : fail (chatroom_id 404)
	# 			4 : fail (User not signed in)

	# Check 4
	current_user = checkUserSignedIn(request)
	if (current_user == False):
		response = {"status": "fail",
					"message": "user authorization fail"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)
	if request.method == "GET":
		# Check 3
		chatroom = ChatRoom.objects.filter(pk=id)
		if len(chatroom) == 0:
			response = {"status": "fail",
						"message": "chatroom not exist"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# Check 2
		is_user_exist_in_chatroom = ChatRoomUserRelation.objects.filter(user=current_user[0],chat_room=chatroom[0])
		if len(is_user_exist_in_chatroom) == 0:
			response = {"status": "fail",
						"message": "user is not exist in this chat"}
			result = json.dumps(response, ensure_ascii=False)
			return HttpResponse(result)
		# 1
		try:
			message = Message.objects.filter(chat_room=chatroom[0]).order_by('-created_at').all()[0]
			message_json = {"id": message.id, "content": message.content,
							"image": str(message.image), "created_at": str(message.created_at)}
			response = {"status": "success",
						"message": "ok",
						"messages": message_json}
			result = json.dumps(response)
			return HttpResponse(result)
		except:
			response = {"status": "fail",
						"message": "message not exist"}
			result = json.dumps(response)
			return HttpResponse(result)
	else:
		response = {"status": "fail",
					"message": "not providing GET request"}
		result = json.dumps(response, ensure_ascii=False)
		return HttpResponse(result)

# 6 : 共有

def checkCsrfToken(csrf_token):
	csrfs = CsrfToken.objects.filter(content=csrf_token)
	# print(csrf_token)
	if (len(csrfs) > 0):
		csrfs.delete()
		return True
	else:
		return False

def checkUserSignedIn(request):
	cookie = request.COOKIES.get("chat_user_cookie")
	email = request.COOKIES.get("chat_user_email")
	cookie_user = User.objects.filter(email=email, cookie=cookie)
	if (len(cookie_user) == 0):
		return False
	else:
		return cookie_user

def set_cookie(response, key, value, max_age):
	expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
	response.set_cookie(key, value, max_age=max_age, expires=expires)
