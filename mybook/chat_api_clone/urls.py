from django.urls import path
from . import views

urlpatterns = [
	# Login 関係
	path('users/sign_up', views.userCreate, name="user_sign_up"),
	path('users/sign_in', views.userSignIn, name="user_sign_in"),
	path('users/update', views.updateUser, name="user_update"),
	path('users/upload_image', views.uploadImageUser, name="user_upload_image"),
	path('generate_csrf', views.generateCsrfToken, name="generate_csrf"),
	path('current_user', views.currentUser, name="show_current_user"),
	# Users 関係
	path('users/<int:id>', views.showUser, name="user_show"),
	path('users/<int:id>/is_chat', views.isChatUser, name="user_is_chat_user"),
	path('current_user/users', views.currentUserUsers, name=""),
	# ChatRoom 関係
	path('chatrooms/new', views.createChatroom, name="chatroom_new"),
	path('group_chatrooms/new', views.createGroupChatroom, name="group_chatroom_new"),
	path('chatrooms/<int:id>', views.showChatroom, name="chatroom_show"),
	path('chatrooms/<int:id>/upload_image', views.uploadImageChatroom, name="chatroom_upload_image"),
	path('current_chatrooms', views.showCurrentUsersChatroom, name="currentuser_chatroom"),
	path('chatrooms/<int:id>/users', views.showChatroomUsers, name="chatroom_users"),
	path('chatrooms/<int:id>/single_user', views.showSingleChatroomUser, name="single_chatroom_user"),
	# Group Chat ChatRoomUserRelation 関係
	path('chatrooms/<int:id>/add_user', views.addUserToGroupChat, name="chatroom_add_user"),
	path('chatrooms/<int:id>/remove_user', views.removeUserToGroupChat, name="chatroom_remove_user"),
	# Message 関係
	path('chatrooms/<int:id>/messages', views.sendMessage, name="send_message"),
	path('chatrooms/<int:id>/last_message', views.lastMessage, name="show_last_message"),
	path('chatrooms/<int:id>/unread_message', views.getUnreadMessage, name="show_unread_message"),
]