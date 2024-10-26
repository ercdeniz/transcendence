from rest_framework import serializers

from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'is_2fa_enabled')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            is_2fa_enabled=validated_data.get('is_2fa_enabled', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    @staticmethod
    def validate_is_2fa_enabled(value):
        if not isinstance(value, bool):
            raise serializers.ValidationError("is_2fa_enabled must be a boolean.")
        return value
