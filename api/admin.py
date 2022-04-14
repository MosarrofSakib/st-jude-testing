from django.contrib import admin
from .models import Patient, Treatment,PatientAppointment,ProcessPayments,PaymentsBreakdown


admin.site.register(Patient)
admin.site.register(Treatment)
admin.site.register(PatientAppointment)
admin.site.register(ProcessPayments)
admin.site.register(PaymentsBreakdown)
