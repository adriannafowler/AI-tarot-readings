from django.urls import path
from accounts.views import LoginView, LogoutView, SignUpView, UserInfoView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('userinfo/', UserInfoView.as_view(), name='userinfo'),
]
