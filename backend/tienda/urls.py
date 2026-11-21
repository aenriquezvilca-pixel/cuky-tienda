from django.urls import path

from . import views

urlpatterns = [
    path("categorias/", views.CategoriaList.as_view(), name="categorias"),
    path("productos/", views.ProductoList.as_view(), name="productos"),
    path("productos/<int:pk>/", views.ProductoDetail.as_view(), name="producto-detalle"),
    path(
        "productos/<int:pk>/recomendados/",
        views.RecomendadosDeProducto.as_view(),
        name="producto-recomendados",
    ),
    path("promociones/", views.PromocionList.as_view(), name="promociones"),
    path("recomendados/", views.RecomendadosGenerales.as_view(), name="recomendados"),
    path("inventario/", views.InventarioResumen.as_view(), name="inventario"),
    path("reclamaciones/", views.ReclamacionCreate.as_view(), name="reclamaciones"),
]
