from rest_framework import urlpatterns
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, TreatmentViewSet, PatientAppointmentViewSet, ProcessPaymentsViewSet,PaymentsBreakdownViewSet


router = DefaultRouter()

router.register('patients', PatientViewSet, basename='patients')
router.register('treatments', TreatmentViewSet, basename='treatments')
router.register('appointments', PatientAppointmentViewSet, basename='appointments')
router.register('payments', ProcessPaymentsViewSet, basename='payments')
router.register('breakdowns',PaymentsBreakdownViewSet,basename='breakdowns')

urlpatterns = router.urls