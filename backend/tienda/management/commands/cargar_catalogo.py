"""Actualiza el catálogo de Cuky: fotos distintas para cada producto, descuentos,
destacados, más vendidos y stock mínimo.

Uso (con el entorno virtual activado, dentro de la carpeta backend):
    python manage.py cargar_catalogo

Si un producto ya existe (mismo nombre), solo se actualizan la imagen y los datos
de marketing; no se tocan su descripción, precio ni stock. Si no existe, se crea.
Se puede ejecutar varias veces sin duplicar nada.
"""
from django.core.management.base import BaseCommand

from tienda.models import Categoria, Producto


def foto(id_foto):
    return f"https://images.unsplash.com/photo-{id_foto}?auto=format&fit=crop&w=900&q=80"


# (nombre, categoría, precio, stock, descripción, foto, descuento %, vendidos, destacado)
DATOS = [
    # Tortas
    ("Torta de chocolate", "Tortas", 65, 8, "Bizcocho húmedo de cacao con ganache de chocolate semiamargo.", "1578985545062-69928b1d9587", 0, 48, True),
    ("Torta de fresas", "Tortas", 70, 5, "Bizcocho de vainilla, crema chantilly y fresas frescas.", "1464349095431-e9a21285b5f3", 0, 41, True),
    ("Torta tres leches", "Tortas", 68, 6, "Bizcocho empapado en tres leches con merengue suave.", "1588195538326-c5b1e9f80a1b", 15, 37, False),
    ("Torta de zanahoria", "Tortas", 62, 4, "Bizcocho especiado con nueces y frosting de queso crema.", "1621303837174-89787a7d4729", 0, 22, False),
    ("Torta de limón", "Tortas", 60, 7, "Bizcocho cítrico con crema de limón y ralladura fresca.", "1618426703623-c1b335803e07", 10, 19, False),
    ("Torta selva negra", "Tortas", 75, 3, "Chocolate, cerezas y crema chantilly en capas.", "1606890737304-57a1ca8a5b62", 0, 33, True),
    ("Torta de maracuyá", "Tortas", 72, 5, "Bizcocho de vainilla con mousse de maracuyá y cobertura brillante.", "1626263468007-a9e0cf83f1ac", 25, 15, False),
    # Cupcakes
    ("Cupcakes de vainilla", "Cupcakes", 24, 20, "Caja de 6 unidades con buttercream suave y chispitas.", "1486427944299-d1955d23e34d", 0, 52, False),
    ("Cupcakes red velvet", "Cupcakes", 28, 12, "Caja de 6 unidades con crema de queso y migas rojas.", "1614707267537-b85aaf00c4b7", 0, 44, True),
    ("Cupcakes de chocolate", "Cupcakes", 26, 15, "Caja de 6 unidades con ganache y virutas de cacao.", "1603532648955-039310d9ed75", 0, 39, False),
    ("Cupcakes de limón", "Cupcakes", 26, 10, "Caja de 6 unidades con crema de limón y merengue.", "1576618148400-f54bed99fcfd", 0, 18, False),
    ("Cupcakes de fresa", "Cupcakes", 27, 14, "Caja de 6 unidades con buttercream de fresa natural.", "1599785209796-786432b228bc", 10, 31, False),
    ("Cupcakes de dulce de leche", "Cupcakes", 28, 0, "Caja de 6 unidades rellenos de manjar blanco.", "1587668178277-295251f900ce", 0, 27, False),
    # Galletas
    ("Galletas con chispas", "Galletas", 15, 30, "Bolsa de 10 galletas crocantes con chispas de chocolate.", "1499636136210-6f4ee915583e", 0, 60, True),
    ("Galletas de avena", "Galletas", 14, 0, "Bolsa de 10 galletas de avena, pasas y un toque de canela.", "1558961363-fa8fdf82db35", 0, 25, False),
    ("Galletas de mantequilla", "Galletas", 16, 25, "Bolsa de 12 galletas clásicas de mantequilla.", "1597733153203-a54d0fbc47de", 20, 34, False),
    ("Galletas rellenas de manjar", "Galletas", 18, 18, "Pack de 8 alfajores bañados en azúcar impalpable.", "1598839950984-034f6dc7b495", 0, 29, False),
    ("Galletas de jengibre", "Galletas", 15, 12, "Bolsa de 10 galletas especiadas con glaseado.", "1583743089695-4b816a340f82", 0, 14, False),
    ("Galletas decoradas", "Galletas", 30, 9, "Set de 6 galletas con glasé en colores pastel.", "1557310717-d6bea9f36682", 0, 21, False),
    # Helados
    ("Helado de vainilla", "Helados", 22, 20, "Pote de 1 litro con vainas naturales.", "1560008581-09826d1de69e", 0, 40, False),
    ("Helado de chocolate", "Helados", 22, 18, "Pote de 1 litro con cacao intenso.", "1562790879-dfde82829db0", 0, 38, False),
    ("Helado de fresa", "Helados", 22, 16, "Pote de 1 litro con trozos de fresa.", "1497034825429-c343d7c6a68f", 10, 35, False),
    ("Helado de lúcuma", "Helados", 24, 14, "Pote de 1 litro con lúcuma peruana.", "1576506295286-5cda18df43e7", 0, 30, True),
    ("Helado de maracuyá", "Helados", 23, 11, "Pote de 1 litro, fresco y ligeramente ácido.", "1567206563064-6f60f40a2b57", 0, 17, False),
    ("Helado de pistacho", "Helados", 28, 6, "Pote de 1 litro con pistachos tostados.", "1570197788417-0e82375c9371", 0, 12, False),
    ("Paleta de frutas", "Helados", 18, 0, "Pack de 6 paletas de fruta natural.", "1783711394928-f93f63a6bf8e", 15, 16, False),
]

# Fotos de reserva (distintas a las anteriores) para productos que no estén en la lista
RESERVA = {
    "Tortas": ["1534432182912-63863115e106"],
    "Cupcakes": [
        "1550617931-e17a7b70dce2", "1623246123320-0d6636755796", "1563729784474-d77dbb933a9e",
        "1599785209707-a456fc1337bb", "1607478900766-efe13248b125", "1652284918100-1fd4a60e7356",
        "1519869325930-281384150729",
    ],
    "Galletas": ["1639678111962-88fffeb071cb", "1657418830273-40c19cfff4d7", "1634188023615-7e08901193b6"],
    "Helados": ["1580915411954-282cb1b0d780", "1633933358116-a27b902fad35", "1629385701021-fcd568a743e8"],
}


class Command(BaseCommand):
    help = "Asigna fotos distintas a cada producto y carga descuentos, destacados y más vendidos."

    def handle(self, *args, **opciones):
        creados = actualizados = 0
        nombres = []
        usadas = set()

        for nombre, cat, precio, stock, desc, id_foto, descuento, vendidos, destacado in DATOS:
            nombres.append(nombre)
            usadas.add(id_foto)
            categoria, _ = Categoria.objects.get_or_create(nombre=cat)
            producto = Producto.objects.filter(nombre=nombre).first()
            if producto:
                producto.imagen = foto(id_foto)
                producto.descuento = descuento
                producto.vendidos = vendidos
                producto.destacado = destacado
                producto.stock_minimo = 5
                producto.save()
                actualizados += 1
            else:
                Producto.objects.create(
                    nombre=nombre, categoria=categoria, precio=precio, cantidad=stock,
                    descripcion=desc, imagen=foto(id_foto), descuento=descuento,
                    vendidos=vendidos, destacado=destacado, stock_minimo=5,
                )
                creados += 1

        # Productos que no estaban en la lista: se les asigna una foto de reserva sin repetir
        otros = 0
        for producto in Producto.objects.exclude(nombre__in=nombres).select_related("categoria"):
            for id_foto in RESERVA.get(producto.categoria.nombre, []):
                if id_foto not in usadas:
                    usadas.add(id_foto)
                    producto.imagen = foto(id_foto)
                    producto.save(update_fields=["imagen"])
                    otros += 1
                    break

        self.stdout.write(
            self.style.SUCCESS(
                f"Catálogo listo: {actualizados} actualizados, {creados} creados, "
                f"{otros} con foto de reserva. Total: {Producto.objects.count()} productos."
            )
        )
