// Tipos para la aplicación

export type Prenda = {
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

export type Outfit = {
  id: string
  nombre: string
  ocasion: string
  temporada: string[]
  prendas: string[] // IDs de prendas
  imagen: string
  fechaCreacion: string
  favorito: boolean
  notas?: string
}

export type EventoAgenda = {
  id: string
  titulo: string
  fecha: string
  outfitId?: string
  notas?: string
  recordatorio: boolean
}

export type PreferenciasEstilo = {
  coloresFavoritos: string[]
  estampados: string[]
  prendasFavoritas: string[]
  ocasionesFrecuentes: string[]
  estiloPersonal: string
}

export type Estadisticas = {
  categoria: string
  cantidad: number
  porcentaje: number
}

export type CombinacionPopular = {
  id: string
  nombre: string
  frecuencia: "Alta" | "Media" | "Baja"
  prendas: string[] // IDs de prendas
}

export type ConfiguracionUsuario = {
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

export type Mensaje = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export type Conversacion = {
  id: string
  titulo: string
  mensajes: Mensaje[]
  fechaCreacion: string
  fechaActualizacion: string
}
