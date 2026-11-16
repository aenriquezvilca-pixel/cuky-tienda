const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const categorias = ["Todos", "Tortas", "Cupcakes", "Galletas"];

export const productos = [
  {
    id: 1,
    nombre: "Torta de chocolate",
    descripcion: "Bizcocho húmedo de cacao con ganache de chocolate semiamargo.",
    precio: 65,
    imagen: img("1578985545062-69928b1d9587"),
    categoria: "Tortas",
    cantidad: 8,
  },
  {
    id: 2,
    nombre: "Torta de fresas",
    descripcion: "Bizcocho de vainilla, crema chantilly y fresas frescas.",
    precio: 70,
    imagen: img("1464349095431-e9a21285b5f3"),
    categoria: "Tortas",
    cantidad: 5,
  },
  {
    id: 3,
    nombre: "Cupcakes de vainilla",
    descripcion: "Caja de 6 unidades con buttercream suave y chispitas.",
    precio: 24,
    imagen: img("1486427944299-d1955d23e34d"),
    categoria: "Cupcakes",
    cantidad: 20,
  },
  {
    id: 4,
    nombre: "Cupcakes red velvet",
    descripcion: "Caja de 6 unidades con crema de queso y migas rojas.",
    precio: 28,
    imagen: img("1519869325930-281384150729"),
    categoria: "Cupcakes",
    cantidad: 12,
  },
  {
    id: 5,
    nombre: "Galletas con chispas",
    descripcion: "Bolsa de 10 galletas crocantes con chispas de chocolate.",
    precio: 15,
    imagen: img("1499636136210-6f4ee915583e"),
    categoria: "Galletas",
    cantidad: 30,
  },
  {
    id: 6,
    nombre: "Galletas de avena",
    descripcion: "Bolsa de 10 galletas de avena, pasas y un toque de canela.",
    precio: 14,
    imagen: img("1558961363-fa8fdf82db35"),
    categoria: "Galletas",
    cantidad: 0,
  },
];
