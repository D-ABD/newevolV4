from django.db import models
from django.contrib.auth.models import User
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class CalendarEntry(models.Model):
    """Modèle pour les entrées du calendrier de progression"""
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calendar_entries')
    date = models.DateField()
    entry_count = models.IntegerField(default=0)
    average_mood = models.FloatField(default=0)
    completed_habits = models.IntegerField(default=0)
    streak_day = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user.username} - {self.date}"


class PushNotification(models.Model):
    """Modèle pour les notifications push"""
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='push_notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=[
        ('reminder', 'Rappel'),
        ('achievement', 'Succès'),
        ('challenge', 'Défi'),
        ('social', 'Social'),
        ('custom', 'Personnalisé'),
    ])
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"


class NotificationToken(models.Model):
    """Modèle pour stocker les tokens de notifications push (Firebase/Web Push)"""
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_tokens')
    token = models.TextField(unique=True)
    platform = models.CharField(max_length=20, choices=[
        ('web', 'Web'),
        ('ios', 'iOS'),
        ('android', 'Android'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.platform}"


class Category(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)
    color = models.CharField(max_length=20)
    custom = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='categories')

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Entry(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    content = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='entries')
    timestamp = models.DateTimeField(auto_now_add=True)
    mood = models.IntegerField()
    tags = models.JSONField(default=list, blank=True)
    image_url = models.URLField(blank=True, null=True)
    is_public = models.BooleanField(default=False)
    likes = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')

    def __str__(self):
        return f"Entry by {self.user.username} - {self.timestamp}"


class Comment(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username}"


class Badge(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50)
    earned = models.BooleanField(default=False)
    earned_date = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')

    def __str__(self):
        return self.name


class Achievement(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    name = models.CharField(max_length=100)
    description = models.TextField()
    progress = models.IntegerField(default=0)
    target = models.IntegerField()
    completed_date = models.DateTimeField(null=True, blank=True)
    category = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')

    def __str__(self):
        return self.name


class WeeklyGoal(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    category = models.CharField(max_length=100)
    target = models.IntegerField()
    current = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weekly_goals')

    def __str__(self):
        return f"{self.category} Goal"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True)
    level = models.IntegerField(default=1)
    experience = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    theme = models.CharField(max_length=10, choices=[('light', 'Light'), ('dark', 'Dark')], default='light')
    notifications = models.BooleanField(default=True)
    reminder_time = models.TimeField(null=True, blank=True)
    join_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Challenge(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.IntegerField()  # in days
    participants = models.IntegerField(default=0)
    target = models.IntegerField()
    progress = models.IntegerField(default=0)
    joined = models.BooleanField(default=False)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    reward_type = models.CharField(max_length=20, choices=[('badge', 'Badge'), ('points', 'Points'), ('achievement', 'Achievement')], null=True, blank=True)
    reward_value = models.CharField(max_length=100, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='challenges', null=True, blank=True)

    def __str__(self):
        return self.title


class Habit(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100)
    frequency = models.CharField(max_length=10, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('monthly', 'Monthly')])
    target = models.IntegerField()
    current = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    color = models.CharField(max_length=20)
    icon = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_dates = models.JSONField(default=list)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')

    def __str__(self):
        return self.name


class Reminder(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    type = models.CharField(max_length=10, choices=[('daily', 'Daily'), ('weekly', 'Weekly'), ('custom', 'Custom')])
    message = models.TextField()
    time = models.TimeField()
    days = models.JSONField(default=list)  # list of day numbers (0-6 for Monday-Sunday)
    active = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.type} Reminder for {self.user.username}"


class Quote(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=generate_uuid)
    text = models.TextField()
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=100)

    def __str__(self):
        return f'"{self.text}" by {self.author}'
