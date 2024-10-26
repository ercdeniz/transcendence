from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import DeleteUserView, RegisterUserView, ListUsersView, LogoutView, CustomTokenObtainPairView, Verify2FACodeView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('list_users/', ListUsersView.as_view(), name='list_users'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('verify_2fa_code/', Verify2FACodeView.as_view(), name='verify_2fa_code'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('delete_user_data/', DeleteUserView.as_view(), name='delete_user_data'),
]
