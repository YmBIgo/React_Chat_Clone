from django.db import models
import uuid

# Create your models here.

def upload_user_path(self, filename):
	ext = filename.split(".")[-1]
	return '/'.join(['images', 'user', str(self.id), str(self.name) + ext])

def upload_chat_path(self, filename):
	ext = filename.split(".")[-1]
	return '/'.join(['images', 'chat', str(self.id), str(self.name) + ext])

def upload_message_path(self, filename):
	ext = filename.split(".")[-1]
	name = str(uuid.uuid4()).replace("-", "")
	return '/'.join(['images', 'message', str(self.id), name + ext])

class User(models.Model):
	name = models.CharField(max_length=30, default="", unique=True)
	password = models.CharField(max_length=100, default="")
	first_name = models.CharField(max_length=20, default="")
	last_name = models.CharField(max_length=20, default="")
	description = models.CharField(max_length=1024, default="")
	email = models.EmailField(max_length=128, unique=True)
	image = models.ImageField(upload_to=upload_user_path,default="http://localhost:8000/media/images/logo/chat_default.png")
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	cookie = models.CharField(max_length=256, default="")

	def __str__(self):
		return self.name

class ChatRoom(models.Model):
	name = models.CharField(max_length=30, default="New Chat")
	image = models.ImageField(upload_to=upload_chat_path,default="http://localhost:8000/media/images/logo/chat_default.png")
	is_group = models.BooleanField(default=False)
	user_ids = models.CharField(max_length=1024, default="")
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.name

class ChatRoomUserRelation(models.Model):
	chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	is_group = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class Message(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
	content = models.TextField(default="")
	image = models.ImageField(upload_to=upload_message_path)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

class CsrfToken(models.Model):
	content = models.CharField(max_length=256)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

