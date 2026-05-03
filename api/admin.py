from django.contrib import admin
from .models import (
    Category, Entry, Comment, Badge, Achievement, 
    WeeklyGoal, UserProfile, Challenge, Habit, Reminder, Quote
)

admin.site.register(Category)
admin.site.register(Entry)
admin.site.register(Comment)
admin.site.register(Badge)
admin.site.register(Achievement)
admin.site.register(WeeklyGoal)
admin.site.register(UserProfile)
admin.site.register(Challenge)
admin.site.register(Habit)
admin.site.register(Reminder)
admin.site.register(Quote)
