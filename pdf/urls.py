from django.urls import path
from . import views

app_name = 'pdf'

urlpatterns = [
    path('converter/', views.converter_pdf, name='converter_pdf'),
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('view/<str:filename>/', views.view_converted_file, name='view_converted_file'),
    path('download/<str:filename>/', views.download_converted_file, name='download_converted_file'),
]
