import random

from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated

from django.conf import settings

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]  # Kullanıcının oturum açtığını doğrulamak için

    def delete(self, request):
        user = request.user  # Giriş yapan kullanıcı
        user.delete()  # Kullanıcıyı sil
        return Response({"success": True}, status=status.HTTP_204_NO_CONTENT)



class RegisterUserView(APIView):
    @staticmethod
    def post(request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(CustomUserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListUsersView(APIView):
    @staticmethod
    def get(request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    @staticmethod
    def post(request):
        refresh_token = request.data.get("refresh_token")
        if refresh_token is None:
            return Response({"detail": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except (TokenError, InvalidToken) as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def send_2fa_code(user):
    code = random.randint(100000, 999999)
    user.otp_code = code
    user.save()

    subject = '2FA Code'
    message = f'Your 2FA code is {code}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    print(f"Sending email to: {recipient_list}")
    print(f"From email: {from_email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}")

    try:
        send_mail(
            subject,
            message,
            from_email,
            recipient_list,
            fail_silently=False,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        raise

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.user

            if user.is_2fa_enabled:
                send_2fa_code(user)
                return Response({"detail": "2FA code sent to your email. Please verify to continue."},
                                status=226) 
            else:
                return super().post(request, *args, **kwargs)

        except InvalidToken as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class Verify2FACodeView(APIView):
    @staticmethod
    def post(request):
        email = request.data.get('email')
        code = request.data.get('code')

        try:
            user = CustomUser.objects.get(email=email)
            if user.otp_code == int(code):
                user.otp_code = None
                user.save()
                refresh = RefreshToken.for_user(user)
                access_token = AccessToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(access_token),
                })

            return Response({"detail": "Invalid 2FA code."}, status=status.HTTP_400_BAD_REQUEST)
        except CustomUser.DoesNotExist:
            return Response({"detail": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
