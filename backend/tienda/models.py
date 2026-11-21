from decimal import ROUND_HALF_UP, Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models, transaction
from django.utils import timezone


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "categoría"
        verbose_name_plural = "categorías"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    imagen = models.URLField(max_length=500)
    cantidad = models.PositiveIntegerField("stock actual", default=0)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        related_name="productos",
    )

    # Marketing: promociones y descuentos
    descuento = models.PositiveSmallIntegerField(
        "descuento (%)",
        default=0,
        validators=[MaxValueValidator(90)],
        help_text="Porcentaje de descuento (0 a 90). Con 0 el producto no está en oferta.",
    )
    destacado = models.BooleanField(default=False)

    # Inventario y recomendaciones
    stock_minimo = models.PositiveIntegerField(
        "stock mínimo",
        default=5,
        help_text="Si el stock es igual o menor a este valor, se muestra como stock bajo.",
    )
    vendidos = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.nombre

    @property
    def precio_final(self):
        precio = Decimal(str(self.precio))
        final = precio * (100 - self.descuento) / 100
        return final.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @property
    def estado_stock(self):
        if self.cantidad <= 0:
            return "agotado"
        if self.cantidad <= self.stock_minimo:
            return "bajo"
        return "disponible"


class MovimientoInventario(models.Model):
    """Registro de entradas y salidas. Al crearlo, actualiza el stock del producto."""

    ENTRADA = "E"
    VENTA = "V"
    MERMA = "M"
    TIPOS = [
        (ENTRADA, "Entrada (reposición)"),
        (VENTA, "Salida por venta"),
        (MERMA, "Salida por merma o ajuste"),
    ]

    producto = models.ForeignKey(
        Producto, on_delete=models.CASCADE, related_name="movimientos"
    )
    tipo = models.CharField(max_length=1, choices=TIPOS)
    cantidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    motivo = models.CharField(max_length=150, blank=True)
    fecha = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-fecha", "-id"]
        verbose_name = "movimiento de inventario"
        verbose_name_plural = "movimientos de inventario"

    def __str__(self):
        return f"{self.get_tipo_display()}: {self.cantidad} x {self.producto}"

    def clean(self):
        es_salida = self.tipo in (self.VENTA, self.MERMA)
        if (
            self.pk is None
            and es_salida
            and self.producto_id
            and self.cantidad
            and self.cantidad > self.producto.cantidad
        ):
            raise ValidationError(
                f"No hay stock suficiente: {self.producto.nombre} tiene "
                f"{self.producto.cantidad} unidades."
            )

    @transaction.atomic
    def save(self, *args, **kwargs):
        es_nuevo = self.pk is None
        super().save(*args, **kwargs)
        if not es_nuevo:
            return
        producto = self.producto
        if self.tipo == self.ENTRADA:
            producto.cantidad += self.cantidad
        else:
            producto.cantidad = max(0, producto.cantidad - self.cantidad)
            if self.tipo == self.VENTA:
                producto.vendidos += self.cantidad
        producto.save(update_fields=["cantidad", "vendidos"])


class Reclamacion(models.Model):
    """Hoja de reclamación del Libro de Reclamaciones virtual."""

    TIPOS = [("reclamo", "Reclamo"), ("queja", "Queja")]
    DOCUMENTOS = [("DNI", "DNI"), ("CE", "Carné de extranjería"), ("PAS", "Pasaporte")]
    BIENES = [("producto", "Producto"), ("servicio", "Servicio")]

    codigo = models.CharField(max_length=20, unique=True, null=True, blank=True, editable=False)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    nombres = models.CharField("nombres y apellidos", max_length=150)
    tipo_documento = models.CharField(max_length=3, choices=DOCUMENTOS, default="DNI")
    documento = models.CharField("número de documento", max_length=20)
    email = models.EmailField("correo electrónico")
    telefono = models.CharField("teléfono", max_length=20)
    domicilio = models.CharField(max_length=200)
    bien = models.CharField("bien contratado", max_length=10, choices=BIENES, default="producto")
    descripcion_bien = models.CharField("descripción del producto o servicio", max_length=200)
    monto = models.DecimalField("monto reclamado (S/)", max_digits=8, decimal_places=2, null=True, blank=True)
    detalle = models.TextField("detalle del reclamo o queja")
    pedido = models.TextField("pedido del consumidor")
    fecha = models.DateTimeField(default=timezone.now)
    atendido = models.BooleanField(default=False)
    respuesta = models.TextField("respuesta de la tienda", blank=True)

    class Meta:
        ordering = ["-fecha"]
        verbose_name = "reclamación"
        verbose_name_plural = "libro de reclamaciones"

    def __str__(self):
        return f"{self.codigo or 'Nueva'} - {self.nombres}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.codigo:
            self.codigo = f"HR-{self.fecha.year}-{self.pk:05d}"
            super().save(update_fields=["codigo"])
