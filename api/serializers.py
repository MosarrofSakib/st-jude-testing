from rest_framework import serializers
from .models import Patient,Treatment,PatientAppointment, ProcessPayments,PaymentsBreakdown


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

    # def create(self, validated_data):
    #     if Patient.objects.filter(telephone=self.context['request'].telephone).exists():
    #         raise serializers.ValidationError("This number Already exists.")
    #     new_patient = Patient.objects.create(**validated_data)
    #     return new_patient


class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = '__all__'


class PatientAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAppointment
        fields = '__all__'
        depth = 2


class ProcessPaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessPayments
        fields = '__all__'
        depth = 2


class PaymentsBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentsBreakdown
        fields = '__all__'
        depth = 2