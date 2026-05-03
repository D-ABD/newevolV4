from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Category, Entry, Comment, Badge, Achievement, 
    WeeklyGoal, UserProfile, Challenge, Habit, Reminder, Quote,
    CalendarEntry, PushNotification, NotificationToken
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'entry', 'user', 'user_name', 'content', 'timestamp']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'color', 'custom', 'user']


class EntrySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    comments_list = CommentSerializer(source='comments', many=True, read_only=True)
    
    class Meta:
        model = Entry
        fields = [
            'id', 'content', 'category', 'category_name', 'timestamp', 
            'mood', 'tags', 'image_url', 'is_public', 'likes', 'user', 'comments_list'
        ]
        read_only_fields = ['user']
    
    def to_internal_value(self, data):
        # Si category est une chaîne (nom de catégorie), trouver l'objet correspondant
        if isinstance(data.get('category'), str):
            category_id = data['category']
            # Essayer de trouver par ID d'abord
            try:
                from .models import Category
                category = Category.objects.get(id=category_id)
                data['category'] = category.id
            except Category.DoesNotExist:
                # Sinon, essayer de trouver par nom
                try:
                    category = Category.objects.get(name=category_id)
                    data['category'] = category.id
                except Category.DoesNotExist:
                    raise serializers.ValidationError({
                        'category': f"La catégorie '{category_id}' n'existe pas."
                    })
        return super().to_internal_value(data)
    
    def create(self, validated_data):
        # Le user est automatiquement défini depuis la vue
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)


class BadgeSerializer(serializers.ModelSerializer):
    earned_date = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'earned', 'earned_date', 'user']


class AchievementSerializer(serializers.ModelSerializer):
    completed_date = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'progress', 'target', 
            'completed_date', 'category', 'user'
        ]


class WeeklyGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyGoal
        fields = ['id', 'category', 'target', 'current', 'completed', 'user']


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'user', 'username', 'email', 'avatar', 'bio', 'level', 
            'experience', 'streak_days', 'theme', 'notifications', 
            'reminder_time', 'join_date'
        ]


class ChallengeSerializer(serializers.ModelSerializer):
    start_date = serializers.DateTimeField(read_only=True)
    end_date = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'title', 'description', 'duration', 'participants', 
            'target', 'progress', 'joined', 'start_date', 'end_date', 
            'reward_type', 'reward_value', 'user'
        ]


class HabitSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Habit
        fields = [
            'id', 'name', 'description', 'category', 'frequency', 
            'target', 'current', 'streak', 'color', 'icon', 
            'created_at', 'completed_dates', 'user'
        ]


class ReminderSerializer(serializers.ModelSerializer):
    last_triggered = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Reminder
        fields = [
            'id', 'user', 'type', 'message', 'time', 'days', 
            'active', 'last_triggered'
        ]


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'category']


class AnalyticsSerializer(serializers.Serializer):
    total_entries = serializers.IntegerField()
    average_mood = serializers.FloatField()
    longest_streak = serializers.IntegerField()
    current_streak = serializers.IntegerField()
    categories_distribution = serializers.DictField()
    mood_trend = serializers.FloatField()
    weekly_progress = serializers.FloatField()
    monthly_progress = serializers.FloatField()


class CalendarEntrySerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%Y-%m-%d')
    
    class Meta:
        model = CalendarEntry
        fields = ['id', 'user', 'date', 'entry_count', 'average_mood', 'completed_habits', 'streak_day']
        read_only_fields = ['user']


class PushNotificationSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    scheduled_for = serializers.DateTimeField(required=False, allow_null=True)
    
    class Meta:
        model = PushNotification
        fields = [
            'id', 'user', 'title', 'message', 'notification_type',
            'is_read', 'created_at', 'scheduled_for', 'sent'
        ]
        read_only_fields = ['user', 'sent']


class NotificationTokenSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    last_used = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = NotificationToken
        fields = ['id', 'user', 'token', 'platform', 'created_at', 'last_used', 'active']
        read_only_fields = ['user', 'created_at', 'last_used']
