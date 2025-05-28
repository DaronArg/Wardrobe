import type {
  Prenda,
  Outfit,
  EventoAgenda,
  PreferenciasEstilo,
  Estadisticas,
  CombinacionPopular,
  ConfiguracionUsuario,
  Conversacion,
} from "@/lib/types"

// Datos de ejemplo para prendas
export const prendasData: Prenda[] = [
  {
    id: "p1",
    nombre: "Camisa blanca",
    categoria: "Camisas",
    color: "Blanco",
    temporada: ["Primavera", "Verano", "Otoño"],
    ocasiones: ["Formal", "Trabajo", "Casual"],
    imagen: "/white-shirt.png",
    fechaCompra: "2024-01-15",
    marca: "Zara",
    precio: 29.99,
    favorito: true,
    notas: "Camisa básica de algodón, corte slim fit",
  },
  {
    id: "p2",
    nombre: "Jeans azules",
    categoria: "Pantalones",
    color: "Azul",
    temporada: ["Primavera", "Otoño", "Invierno"],
    ocasiones: ["Casual", "Diario"],
    imagen: "/classic-blue-jeans.png",
    fechaCompra: "2023-11-20",
    marca: "Levi's",
    precio: 59.99,
    favorito: true,
    notas: "Jeans clásicos, corte recto",
  },
  {
    id: "p3",
    nombre: "Suéter beige",
    categoria: "Suéteres",
    color: "Beige",
    temporada: ["Otoño", "Invierno"],
    ocasiones: ["Casual", "Diario"],
    imagen: "/beige-sweater.png",
    fechaCompra: "2023-09-05",
    marca: "H&M",
    precio: 35.5,
    favorito: false,
    notas: "Suéter de punto, tejido grueso",
  },
  {
    id: "p4",
    nombre: "Vestido negro",
    categoria: "Vestidos",
    color: "Negro",
    temporada: ["Primavera", "Verano", "Otoño"],
    ocasiones: ["Formal", "Fiesta", "Cena"],
    imagen: "/elegant-black-dress.png",
    fechaCompra: "2023-12-10",
    marca: "Mango",
    precio: 49.99,
    favorito: true,
    notas: "Vestido midi, corte recto",
  },
  {
    id: "p5",
    nombre: "Chaqueta marrón",
    categoria: "Chaquetas",
    color: "Marrón",
    temporada: ["Otoño", "Invierno"],
    ocasiones: ["Casual", "Diario"],
    imagen: "/brown-jacket.png",
    fechaCompra: "2023-10-15",
    marca: "Pull & Bear",
    precio: 69.99,
    favorito: false,
    notas: "Chaqueta de cuero sintético",
  },
  {
    id: "p6",
    nombre: "Falda plisada",
    categoria: "Faldas",
    color: "Gris",
    temporada: ["Primavera", "Otoño"],
    ocasiones: ["Casual", "Trabajo"],
    imagen: "/pleated-skirt.png",
    fechaCompra: "2024-02-20",
    marca: "Bershka",
    precio: 25.99,
    favorito: false,
    notas: "Falda midi plisada",
  },
  {
    id: "p7",
    nombre: "Blusa floral",
    categoria: "Blusas",
    color: "Multicolor",
    temporada: ["Primavera", "Verano"],
    ocasiones: ["Casual", "Diario"],
    imagen: "/floral-blouse.png",
    fechaCompra: "2024-03-10",
    marca: "Stradivarius",
    precio: 22.99,
    favorito: true,
    notas: "Blusa con estampado floral",
  },
  {
    id: "p8",
    nombre: "Zapatos negros",
    categoria: "Calzado",
    color: "Negro",
    temporada: ["Primavera", "Otoño", "Invierno"],
    ocasiones: ["Formal", "Trabajo"],
    imagen: "/black-shoes.png",
    fechaCompra: "2023-11-05",
    marca: "Clarks",
    precio: 79.99,
    favorito: false,
    notas: "Zapatos de piel, tacón bajo",
  },
]

// Datos de ejemplo para outfits
export const outfitsData: Outfit[] = [
  {
    id: "o1",
    nombre: "Casual de oficina",
    ocasion: "Trabajo",
    temporada: ["Primavera", "Otoño"],
    prendas: ["p1", "p2", "p8"],
    imagen: "/business-casual-outfit.png",
    fechaCreacion: "2024-03-15",
    favorito: true,
    notas: "Perfecto para días de oficina",
  },
  {
    id: "o2",
    nombre: "Fin de semana",
    ocasion: "Casual",
    temporada: ["Primavera", "Verano"],
    prendas: ["p2", "p7"],
    imagen: "/weekend-casual-outfit.png",
    fechaCreacion: "2024-03-20",
    favorito: false,
    notas: "Cómodo para paseos de fin de semana",
  },
  {
    id: "o3",
    nombre: "Cena elegante",
    ocasion: "Formal",
    temporada: ["Primavera", "Verano", "Otoño"],
    prendas: ["p4", "p8"],
    imagen: "/elegant-dinner-outfit.png",
    fechaCreacion: "2024-02-10",
    favorito: true,
    notas: "Ideal para cenas formales",
  },
  {
    id: "o4",
    nombre: "Día de campo",
    ocasion: "Casual",
    temporada: ["Primavera", "Verano"],
    prendas: ["p6", "p7"],
    imagen: "/picnic-outfit.png",
    fechaCreacion: "2024-04-05",
    favorito: false,
    notas: "Perfecto para actividades al aire libre",
  },
]

// Datos de ejemplo para eventos de agenda
export const eventosAgendaData: EventoAgenda[] = [
  {
    id: "e1",
    titulo: "Reunión de trabajo",
    fecha: "2025-05-25",
    outfitId: "o1",
    notas: "Presentación importante",
    recordatorio: true,
  },
  {
    id: "e2",
    titulo: "Cena con amigos",
    fecha: "2025-05-27",
    outfitId: "o3",
    notas: "Restaurante italiano",
    recordatorio: true,
  },
  {
    id: "e3",
    titulo: "Picnic en el parque",
    fecha: "2025-05-30",
    outfitId: "o4",
    notas: "Llevar sombrero",
    recordatorio: false,
  },
  {
    id: "e4",
    titulo: "Salida de fin de semana",
    fecha: "2025-06-01",
    outfitId: "o2",
    notas: "",
    recordatorio: true,
  },
]

// Datos de ejemplo para preferencias de estilo
export const preferenciasEstiloData: PreferenciasEstilo = {
  coloresFavoritos: ["Beige", "Blanco", "Negro", "Azul"],
  estampados: ["Liso", "Rayas sutiles"],
  prendasFavoritas: ["Camisas", "Jeans", "Vestidos midi"],
  ocasionesFrecuentes: ["Trabajo", "Casual", "Cenas informales"],
  estiloPersonal: "Casual elegante con toques minimalistas",
}

// Datos de ejemplo para estadísticas
export const estadisticasData: Estadisticas[] = [
  { categoria: "Camisas", cantidad: 12, porcentaje: 30 },
  { categoria: "Pantalones", cantidad: 8, porcentaje: 20 },
  { categoria: "Vestidos", cantidad: 6, porcentaje: 15 },
  { categoria: "Faldas", cantidad: 4, porcentaje: 10 },
  { categoria: "Chaquetas", cantidad: 5, porcentaje: 12.5 },
  { categoria: "Accesorios", cantidad: 5, porcentaje: 12.5 },
]

// Datos de ejemplo para combinaciones populares
export const combinacionesPopularesData: CombinacionPopular[] = [
  { id: "c1", nombre: "Camisa blanca + Jeans azules", frecuencia: "Alta", prendas: ["p1", "p2"] },
  { id: "c2", nombre: "Vestido negro + Tacones", frecuencia: "Media", prendas: ["p4", "p8"] },
  { id: "c3", nombre: "Suéter beige + Pantalón marrón", frecuencia: "Alta", prendas: ["p3", "p5"] },
  { id: "c4", nombre: "Blusa floral + Falda lisa", frecuencia: "Baja", prendas: ["p7", "p6"] },
]

// Datos de ejemplo para configuración de usuario
export const configuracionUsuarioData: ConfiguracionUsuario = {
  nombre: "Ana García",
  email: "ana.garcia@ejemplo.com",
  notificaciones: {
    nuevasRecomendaciones: true,
    recordatoriosOutfit: true,
    actualizacionesApp: false,
  },
  privacidad: {
    perfilPublico: false,
    compartirEstadisticas: true,
    permitirSugerencias: true,
  },
  tema: "claro",
  tamanoFuente: "mediano",
}

// Datos de ejemplo para conversaciones
export const conversacionesData: Conversacion[] = [
  {
    id: "conv1",
    titulo: "Recomendaciones para cena",
    mensajes: [
      {
        id: "m1",
        role: "user",
        content: "¿Qué me recomiendas para una cena casual?",
        timestamp: "2025-05-20T18:30:00Z",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Para una cena casual, te recomendaría combinar tus jeans azules con la blusa floral y unos zapatos cómodos. Es un look relajado pero elegante que funciona bien para este tipo de ocasiones.",
        timestamp: "2025-05-20T18:30:30Z",
      },
      {
        id: "m3",
        role: "user",
        content: "¿Y si hace frío?",
        timestamp: "2025-05-20T18:31:00Z",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Si hace frío, puedes añadir tu chaqueta marrón sobre la blusa. Combina muy bien con los jeans y le da un toque más sofisticado al conjunto manteniendo la comodidad.",
        timestamp: "2025-05-20T18:31:30Z",
      },
    ],
    fechaCreacion: "2025-05-20T18:30:00Z",
    fechaActualizacion: "2025-05-20T18:31:30Z",
  },
]

// Categorías disponibles
export const categoriasDisponibles = [
  "Todas",
  "Camisas",
  "Blusas",
  "Pantalones",
  "Jeans",
  "Faldas",
  "Vestidos",
  "Suéteres",
  "Chaquetas",
  "Abrigos",
  "Calzado",
  "Accesorios",
]

// Colores disponibles
export const coloresDisponibles = [
  "Blanco",
  "Negro",
  "Gris",
  "Azul",
  "Rojo",
  "Verde",
  "Amarillo",
  "Naranja",
  "Rosa",
  "Morado",
  "Marrón",
  "Beige",
  "Multicolor",
]

// Temporadas disponibles
export const temporadasDisponibles = ["Primavera", "Verano", "Otoño", "Invierno"]

// Ocasiones disponibles
export const ocasionesDisponibles = ["Casual", "Formal", "Trabajo", "Fiesta", "Deporte", "Playa", "Cena", "Diario"]
