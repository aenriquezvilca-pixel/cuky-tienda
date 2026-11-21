from rest_framework import serializers

from .models import Categoria, Producto, Reclamacion


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ["id", "nombre"]


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source="categoria.nombre", read_only=True)
    precio_final = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    en_oferta = serializers.SerializerMethodField()
    estado_stock = serializers.CharField(read_only=True)

    class Meta:
        model = Producto
        fields = [
            "id", "nombre", "descripcion", "precio",
            "imagen", "cantidad", "categoria", "categoria_nombre",
            "descuento", "precio_final", "en_oferta", "destacado",
            "stock_minimo", "vendidos", "estado_stock",
        ]

    def get_en_oferta(self, obj):
        return obj.descuento > 0


class ReclamacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reclamacion
        fields = [
            "id", "codigo", "tipo", "nombres", "tipo_documento", "documento",
            "email", "telefono", "domicilio", "bien", "descripcion_bien",
            "monto", "detalle", "pedido", "fecha",
        ]
        read_only_fields = ["id", "codigo", "fecha"]
