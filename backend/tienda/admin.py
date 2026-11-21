from django.contrib import admin
from django.db.models import F
from django.utils.html import format_html

from .models import Categoria, MovimientoInventario, Producto, Reclamacion


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id", "nombre")


class EstadoStockFilter(admin.SimpleListFilter):
    title = "estado de stock"
    parameter_name = "stock"

    def lookups(self, request, model_admin):
        return [
            ("agotado", "Agotado"),
            ("bajo", "Stock bajo"),
            ("ok", "Disponible"),
        ]

    def queryset(self, request, queryset):
        valor = self.value()
        if valor == "agotado":
            return queryset.filter(cantidad=0)
        if valor == "bajo":
            return queryset.filter(cantidad__gt=0, cantidad__lte=F("stock_minimo"))
        if valor == "ok":
            return queryset.filter(cantidad__gt=F("stock_minimo"))
        return queryset


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        "id", "nombre", "categoria", "precio", "descuento", "precio_con_descuento",
        "cantidad", "stock_minimo", "estado", "vendidos", "destacado",
    )
    list_editable = ("cantidad", "descuento", "destacado")
    list_filter = ("categoria", EstadoStockFilter, "destacado")
    search_fields = ("nombre", "descripcion")
    actions = ["reponer_10", "descuento_10", "quitar_descuento", "marcar_destacado"]

    @admin.display(description="Precio final")
    def precio_con_descuento(self, obj):
        return f"S/ {obj.precio_final}"

    @admin.display(description="Estado")
    def estado(self, obj):
        colores = {"agotado": "#dc2626", "bajo": "#d97706", "disponible": "#16a34a"}
        textos = {"agotado": "Agotado", "bajo": "Stock bajo", "disponible": "Disponible"}
        return format_html(
            '<b style="color:{}">{}</b>', colores[obj.estado_stock], textos[obj.estado_stock]
        )

    @admin.action(description="Reponer 10 unidades a los productos seleccionados")
    def reponer_10(self, request, queryset):
        for producto in queryset:
            MovimientoInventario.objects.create(
                producto=producto,
                tipo=MovimientoInventario.ENTRADA,
                cantidad=10,
                motivo="Reposición rápida desde el administrador",
            )
        self.message_user(request, f"Se repusieron 10 unidades en {queryset.count()} producto(s).")

    @admin.action(description="Aplicar 10% de descuento")
    def descuento_10(self, request, queryset):
        n = queryset.update(descuento=10)
        self.message_user(request, f"Descuento aplicado a {n} producto(s).")

    @admin.action(description="Quitar descuento")
    def quitar_descuento(self, request, queryset):
        n = queryset.update(descuento=0)
        self.message_user(request, f"Descuento retirado de {n} producto(s).")

    @admin.action(description="Marcar como destacados")
    def marcar_destacado(self, request, queryset):
        n = queryset.update(destacado=True)
        self.message_user(request, f"{n} producto(s) marcados como destacados.")


@admin.register(MovimientoInventario)
class MovimientoInventarioAdmin(admin.ModelAdmin):
    list_display = ("fecha", "producto", "tipo", "cantidad", "motivo")
    list_filter = ("tipo", "producto__categoria")
    search_fields = ("producto__nombre", "motivo")
    autocomplete_fields = ("producto",)

    def get_readonly_fields(self, request, obj=None):
        # Un movimiento ya registrado no se edita: se registra uno nuevo para corregir.
        if obj:
            return ("producto", "tipo", "cantidad", "motivo", "fecha")
        return ()


@admin.register(Reclamacion)
class ReclamacionAdmin(admin.ModelAdmin):
    list_display = ("codigo", "tipo", "nombres", "bien", "monto", "fecha", "atendido")
    list_filter = ("tipo", "atendido", "bien")
    search_fields = ("codigo", "nombres", "documento", "email")
    list_editable = ("atendido",)
    readonly_fields = (
        "codigo", "tipo", "nombres", "tipo_documento", "documento", "email",
        "telefono", "domicilio", "bien", "descripcion_bien", "monto",
        "detalle", "pedido", "fecha",
    )
