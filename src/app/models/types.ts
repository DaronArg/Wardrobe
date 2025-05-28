export interface Prenda {
  id: string
  nombre: string
  categoria: string
  color: string
  temporada: string[]
  ocasiones: string[]
  imagen: string
  fechaCompra?: string
  marca?: string
  precio?: number
  favorito: boolean
  notas?: string
}

export interface Outfit {
  id: string
  nombre: string
  ocasion: string
  temporada: string[]
  prendas: string[]
  imagen: string
  fechaCreacion: string
  favorito: boolean
  notas?: string
}

export interface EventoAgenda {
  id: string
  titulo: string
  fecha: string
  outfitId?: string
  notas?: string
  recordatorio: boolean
}

export interface PreferenciasEstilo {
  coloresFavoritos: string[]
  estampados: string[]
  prendasFavoritas: string[]
  ocasionesFrecuentes: string[]
  estiloPersonal: string
}

export interface Estadisticas {
  categoria: string
  cantidad: number
  porcentaje: number
}

export interface CombinacionPopular {
  id: string
  nombre: string
  frecuencia: "Alta" | "Media" | "Baja"
  prendas: string[]
}

export interface ConfiguracionUsuario {
  nombre: string
  email: string
  notificaciones: {
    nuevasRecomendaciones: boolean
    recordatoriosOutfit: boolean
    actualizacionesApp: boolean
  }
  privacidad: {
    perfilPublico: boolean
    compartirEstadisticas: boolean
    permitirSugerencias: boolean
  }
  tema: "claro" | "oscuro" | "sistema"
  tamanoFuente: "pequeno" | "mediano" | "grande"
}

export interface Mensaje {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface Conversacion {
  id: string
  titulo: string
  mensajes: Mensaje[]
  fechaCreacion: string
  fechaActualizacion: string
}
