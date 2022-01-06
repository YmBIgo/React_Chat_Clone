from django.contrib import admin
from .models import User, ChatRoom, ChatRoomUserRelation, Message

# Register your models here.
admin.site.register(User)
admin.site.register(ChatRoom)
admin.site.register(ChatRoomUserRelation)
admin.site.register(Message)