from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # re_path('.*', TemplateView.as_view(template_name='index.html')),
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('auth/', include('user.urls')),
    path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
]


# + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
