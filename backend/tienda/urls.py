from django.urls import path
from . import views

urlpatterns = [
    path("categorias/", views.CategoriaList.as_view(), name="categorias"),
    path("productos/", views.ProductoList.as_view(), name="productos"),
]

