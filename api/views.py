from django.utils import timezone
from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from django.db import models as django_models
from .models import (
    CalendarEntry, PushNotification, NotificationToken,
    Category, Entry, Comment, Badge, Achievement, 
    WeeklyGoal, UserProfile, Challenge, Habit, Reminder, Quote
)
from .serializers import (
    CalendarEntrySerializer, PushNotificationSerializer, NotificationTokenSerializer,
    UserSerializer, CategorySerializer, EntrySerializer, CommentSerializer,
    BadgeSerializer, AchievementSerializer, WeeklyGoalSerializer,
    UserProfileSerializer, ChallengeSerializer, HabitSerializer,
    ReminderSerializer, QuoteSerializer, AnalyticsSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(obj, 'user') and obj.user == request.user


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({'detail': 'Invalid credentials.'}, status=401)

    Token.objects.get_or_create(user=user)
    UserProfile.objects.get_or_create(user=user)
    return Response({'token': Token.objects.get(user=user).key})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'detail': 'username, email and password are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'username already exists.'}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.create(user=user)
    token = Token.objects.create(user=user)
    return Response({'token': token.key}, status=201)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Category.objects.filter(django_models.Q(user=self.request.user) | django_models.Q(user__isnull=True))
        return Category.objects.filter(user__isnull=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Entry.objects.filter(user=self.request.user)
        return Entry.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def public(self, request):
        public_entries = Entry.objects.filter(is_public=True)
        serializer = self.get_serializer(public_entries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        entry = self.get_object()
        entry.likes += 1
        entry.save()
        return Response({'likes': entry.likes})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BadgeViewSet(viewsets.ModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Badge.objects.filter(user=self.request.user)
        return Badge.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Achievement.objects.filter(user=self.request.user)
        return Achievement.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WeeklyGoalViewSet(viewsets.ModelViewSet):
    queryset = WeeklyGoal.objects.all()
    serializer_class = WeeklyGoalSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return WeeklyGoal.objects.filter(user=self.request.user)
        return WeeklyGoal.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return UserProfile.objects.filter(user=self.request.user)
        return UserProfile.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)

        try:
            profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=404)

        if request.method == 'PATCH':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Challenge.objects.filter(user=self.request.user)
        return Challenge.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class HabitViewSet(viewsets.ModelViewSet):
    queryset = Habit.objects.all()
    serializer_class = HabitSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Habit.objects.filter(user=self.request.user)
        return Habit.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Reminder.objects.filter(user=self.request.user)
        return Reminder.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuoteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def random(self, request):
        import random
        quote = random.choice(list(Quote.objects.all()))
        serializer = self.get_serializer(quote)
        return Response(serializer.data)


class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)

        entries = Entry.objects.filter(user=request.user)
        total_entries = entries.count()
        average_mood = entries.aggregate(Avg('mood'))['mood__avg'] or 0
        
        # Calculate streaks (simplified)
        current_streak = UserProfile.objects.filter(user=request.user).values_list('streak_days', flat=True).first() or 0
        longest_streak = current_streak  # Simplified for now

        # Categories distribution
        categories_dist = entries.values('category__name').annotate(count=Count('id'))
        categories_distribution = {item['category__name']: item['count'] for item in categories_dist}

        # Mood trend (simplified)
        mood_trend = average_mood

        # Progress (simplified)
        weekly_progress = 0.0
        monthly_progress = 0.0

        data = {
            'total_entries': total_entries,
            'average_mood': round(average_mood, 2),
            'longest_streak': longest_streak,
            'current_streak': current_streak,
            'categories_distribution': categories_distribution,
            'mood_trend': mood_trend,
            'weekly_progress': weekly_progress,
            'monthly_progress': monthly_progress,
        }

        serializer = AnalyticsSerializer(data)
        return Response(serializer.data)


class CalendarEntryViewSet(viewsets.ModelViewSet):
    queryset = CalendarEntry.objects.all()
    serializer_class = CalendarEntrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CalendarEntry.objects.filter(user=self.request.user)
        return CalendarEntry.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def month(self, request):
        """Récupérer les entrées du calendrier pour un mois donné"""
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or not month:
            return Response({'error': 'year and month parameters are required'}, status=400)
        
        entries = CalendarEntry.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        )
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Résumé du calendrier pour l'année en cours"""
        from django.db.models import Avg, Sum, Count
        
        today = timezone.now().date()
        start_of_year = today.replace(month=1, day=1)
        
        entries = CalendarEntry.objects.filter(
            user=request.user,
            date__gte=start_of_year
        )
        
        total_entries = entries.aggregate(Sum('entry_count'))['entry_count__sum'] or 0
        avg_mood = entries.aggregate(Avg('average_mood'))['average_mood__avg'] or 0
        total_habits = entries.aggregate(Sum('completed_habits'))['completed_habits__sum'] or 0
        streak_days = entries.filter(streak_day=True).count()
        
        return Response({
            'total_entries': total_entries,
            'average_mood': round(avg_mood, 2),
            'total_habits_completed': total_habits,
            'streak_days': streak_days,
            'days_with_entries': entries.count(),
        })


class PushNotificationViewSet(viewsets.ModelViewSet):
    queryset = PushNotification.objects.all()
    serializer_class = PushNotificationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return PushNotification.objects.filter(user=self.request.user).order_by('-created_at')
        return PushNotification.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marquer une notification comme lue"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Marquer toutes les notifications comme lues"""
        PushNotification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Compter le nombre de notifications non lues"""
        count = PushNotification.objects.filter(user=request.user, is_read=False).count()
        return Response({'unread_count': count})


class NotificationTokenViewSet(viewsets.ModelViewSet):
    queryset = NotificationToken.objects.all()
    serializer_class = NotificationTokenSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return NotificationToken.objects.filter(user=request.user, active=True)
        return NotificationToken.objects.none()

    def perform_create(self, serializer):
        # Désactiver les anciens tokens pour ce device
        token = serializer.validated_data.get('token')
        platform = serializer.validated_data.get('platform')
        NotificationToken.objects.filter(
            user=self.request.user,
            token=token,
            platform=platform
        ).update(active=False)
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Désactiver un token de notification"""
        token = self.get_object()
        token.active = False
        token.save()
        return Response({'status': 'deactivated'})


# Import timezone pour les vues
