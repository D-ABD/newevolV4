"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'entries', views.EntryViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'achievements', views.AchievementViewSet)
router.register(r'weekly-goals', views.WeeklyGoalViewSet)
router.register(r'profile', views.UserProfileViewSet, basename='userprofile')
router.register(r'challenges', views.ChallengeViewSet)
router.register(r'habits', views.HabitViewSet)
router.register(r'reminders', views.ReminderViewSet)
router.register(r'quotes', views.QuoteViewSet)
router.register(r'calendar', views.CalendarEntryViewSet, basename='calendar-entry')
router.register(r'notifications', views.PushNotificationViewSet, basename='notification')
router.register(r'notification-tokens', views.NotificationTokenViewSet, basename='notification-token')
router.register(r'analytics', views.AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/login/', views.login_view),
    path('api/auth/register/', views.register_view),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
