from rest_framework import generics
from .models import Categoria, Producto
from .serializers import CategoriaSerializer, ProductoSerializer


class CategoriaList(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoList(generics.ListAPIView):
    queryset = Producto.objects.select_related("categoria").all()
    serializer_class = ProductoSerializer