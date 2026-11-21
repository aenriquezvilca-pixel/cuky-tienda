from django.db.models import DecimalField, ExpressionWrapper, F, Q, Sum
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from .models import Categoria, Producto, Reclamacion
from .serializers import (
    CategoriaSerializer,
    ProductoSerializer,
    ReclamacionSerializer,
)

ORDENES = {
    "precio_asc": "precio",
    "precio_desc": "-precio",
    "nombre": "nombre",
    "vendidos": "-vendidos",
    "descuento": "-descuento",
}


class CategoriaList(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoList(generics.ListAPIView):
    """Listado con filtros opcionales:
    ?categoria=Tortas  ?q=chocolate  ?oferta=1  ?disponible=1  ?orden=precio_asc
    """

    serializer_class = ProductoSerializer

    def get_queryset(self):
        qs = Producto.objects.select_related("categoria")
        p = self.request.query_params

        categoria = p.get("categoria")
        if categoria:
            if categoria.isdigit():
                qs = qs.filter(categoria__id=int(categoria))
            else:
                qs = qs.filter(categoria__nombre__iexact=categoria)

        texto = p.get("q")
        if texto:
            qs = qs.filter(Q(nombre__icontains=texto) | Q(descripcion__icontains=texto))

        if p.get("oferta") == "1":
            qs = qs.filter(descuento__gt=0)
        if p.get("disponible") == "1":
            qs = qs.filter(cantidad__gt=0)

        orden = ORDENES.get(p.get("orden"))
        return qs.order_by(orden, "id") if orden else qs.order_by("id")


class ProductoDetail(generics.RetrieveAPIView):
    queryset = Producto.objects.select_related("categoria")
    serializer_class = ProductoSerializer


class PromocionList(generics.ListAPIView):
    """Productos con descuento y stock disponible, del mayor al menor descuento."""

    serializer_class = ProductoSerializer

    def get_queryset(self):
        return (
            Producto.objects.select_related("categoria")
            .filter(descuento__gt=0, cantidad__gt=0)
            .order_by("-descuento", "id")
        )


def recomendar(producto, limite=4):
    """Recomienda productos parecidos al visto.

    1) Misma categoría (contenido), ordenados por destacado y más vendidos.
    2) Si faltan, completa con los más vendidos de otras categorías.
    Solo recomienda productos con stock.
    """
    base = (
        Producto.objects.select_related("categoria")
        .filter(cantidad__gt=0)
        .exclude(pk=producto.pk)
    )
    resultado = list(
        base.filter(categoria=producto.categoria).order_by("-destacado", "-vendidos", "id")[:limite]
    )
    faltan = limite - len(resultado)
    if faltan > 0:
        ids = [p.pk for p in resultado]
        resultado += list(
            base.exclude(pk__in=ids)
            .exclude(categoria=producto.categoria)
            .order_by("-vendidos", "id")[:faltan]
        )
    return resultado


class RecomendadosDeProducto(APIView):
    def get(self, request, pk):
        producto = get_object_or_404(Producto, pk=pk)
        datos = ProductoSerializer(recomendar(producto), many=True).data
        return Response(datos)


class RecomendadosGenerales(APIView):
    """Los favoritos de la tienda: destacados y más vendidos con stock."""

    def get(self, request):
        qs = (
            Producto.objects.select_related("categoria")
            .filter(cantidad__gt=0)
            .order_by("-destacado", "-vendidos", "id")[:8]
        )
        return Response(ProductoSerializer(qs, many=True).data)


class InventarioResumen(APIView):
    """Resumen de inventario. Solo para administradores (inicia sesión en /admin/)."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        valor = ExpressionWrapper(
            F("precio") * F("cantidad"),
            output_field=DecimalField(max_digits=12, decimal_places=2),
        )
        totales = Producto.objects.aggregate(
            unidades=Sum("cantidad"), valor=Sum(valor)
        )
        campos = ("id", "nombre", "cantidad", "stock_minimo")
        agotados = Producto.objects.filter(cantidad=0)
        bajos = Producto.objects.filter(cantidad__gt=0, cantidad__lte=F("stock_minimo"))
        return Response(
            {
                "total_productos": Producto.objects.count(),
                "unidades_en_stock": totales["unidades"] or 0,
                "valor_inventario": str(totales["valor"] or 0),
                "agotados": agotados.count(),
                "stock_bajo": bajos.count(),
                "lista_agotados": list(
                    agotados.values(*campos, categoria_nombre=F("categoria__nombre"))
                ),
                "lista_stock_bajo": list(
                    bajos.values(*campos, categoria_nombre=F("categoria__nombre"))
                ),
            }
        )


class ReclamacionCreate(generics.CreateAPIView):
    """Registra una hoja del Libro de Reclamaciones (solo POST)."""

    queryset = Reclamacion.objects.all()
    serializer_class = ReclamacionSerializer
