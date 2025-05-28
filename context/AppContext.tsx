"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type {
  Prenda,
  Outfit,
  EventoAgenda,
  PreferenciasEstilo,
  ConfiguracionUsuario,
  Conversacion,
  Mensaje,
} from "@/lib/types"
import {
  prendasData,
  outfitsData,
  eventosAgendaData,
  preferenciasEstiloData,
  configuracionUsuarioData,
  conversacionesData,
} from "@/lib/data"
import { generateId } from "@/lib/utils"

type AppContextType = {
  // Datos
  prendas: Prenda[]
  outfits: Outfit[]
  eventosAgenda: EventoAgenda[]
  preferenciasEstilo: PreferenciasEstilo
  configuracionUsuario: ConfiguracionUsuario
  conversaciones: Conversacion[]
  conversacionActual: Conversacion | null

  // Funciones para prendas
  agregarPrenda: (prenda: Omit<Prenda, "id">) => void
  actualizarPrenda: (id: string, prenda: Partial<Prenda>) => void
  eliminarPrenda: (id: string) => void
  toggleFavoritoPrenda: (id: string) => void

  // Funciones para outfits
  agregarOutfit: (outfit: Omit<Outfit, "id" | "fechaCreacion">) => void
  actualizarOutfit: (id: string, outfit: Partial<Outfit>) => void
  eliminarOutfit: (id: string) => void
  toggleFavoritoOutfit: (id: string) => void

  // Funciones para eventos de agenda
  agregarEvento: (evento: Omit<EventoAgenda, "id">) => void
  actualizarEvento: (id: string, evento: Partial<EventoAgenda>) => void
  eliminarEvento: (id: string) => void

  // Funciones para preferencias de estilo
  actualizarPreferenciasEstilo: (preferencias: Partial<PreferenciasEstilo>) => void

  // Funciones para configuración de usuario
  actualizarConfiguracion: (config: Partial<ConfiguracionUsuario>) => void

  // Funciones para chat
  iniciarNuevaConversacion: () => void
  seleccionarConversacion: (id: string) => void
  enviarMensaje: (contenido: string) => void
  eliminarConversacion: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Estados para los datos
  const [prendas, setPrendas] = useState<Prenda[]>(prendasData)
  const [outfits, setOutfits] = useState<Outfit[]>(outfitsData)
  const [eventosAgenda, setEventosAgenda] = useState<EventoAgenda[]>(eventosAgendaData)
  const [preferenciasEstilo, setPreferenciasEstilo] = useState<PreferenciasEstilo>(preferenciasEstiloData)
  const [configuracionUsuario, setConfiguracionUsuario] = useState<ConfiguracionUsuario>(configuracionUsuarioData)
  const [conversaciones, setConversaciones] = useState<Conversacion[]>(conversacionesData)
  const [conversacionActual, setConversacionActual] = useState<Conversacion | null>(null)

  // Inicializar conversación actual al cargar
  useEffect(() => {
    if (conversaciones.length > 0 && !conversacionActual) {
      setConversacionActual(conversaciones[0])
    }
  }, [conversaciones, conversacionActual])

  // Funciones para prendas
  const agregarPrenda = (prenda: Omit<Prenda, "id">) => {
    const nuevaPrenda: Prenda = {
      ...prenda,
      id: generateId(),
    }
    setPrendas([...prendas, nuevaPrenda])
  }

  const actualizarPrenda = (id: string, prenda: Partial<Prenda>) => {
    setPrendas(prendas.map((p) => (p.id === id ? { ...p, ...prenda } : p)))
  }

  const eliminarPrenda = (id: string) => {
    setPrendas(prendas.filter((p) => p.id !== id))

    // Actualizar outfits que contengan esta prenda
    setOutfits(
      outfits.map((outfit) => {
        if (outfit.prendas.includes(id)) {
          return {
            ...outfit,
            prendas: outfit.prendas.filter((pId) => pId !== id),
          }
        }
        return outfit
      }),
    )
  }

  const toggleFavoritoPrenda = (id: string) => {
    setPrendas(prendas.map((p) => (p.id === id ? { ...p, favorito: !p.favorito } : p)))
  }

  // Funciones para outfits
  const agregarOutfit = (outfit: Omit<Outfit, "id" | "fechaCreacion">) => {
    const nuevoOutfit: Outfit = {
      ...outfit,
      id: generateId(),
      fechaCreacion: new Date().toISOString(),
    }
    setOutfits([...outfits, nuevoOutfit])
  }

  const actualizarOutfit = (id: string, outfit: Partial<Outfit>) => {
    setOutfits(outfits.map((o) => (o.id === id ? { ...o, ...outfit } : o)))
  }

  const eliminarOutfit = (id: string) => {
    setOutfits(outfits.filter((o) => o.id !== id))

    // Actualizar eventos que usen este outfit
    setEventosAgenda(
      eventosAgenda.map((evento) => {
        if (evento.outfitId === id) {
          return {
            ...evento,
            outfitId: undefined,
          }
        }
        return evento
      }),
    )
  }

  const toggleFavoritoOutfit = (id: string) => {
    setOutfits(outfits.map((o) => (o.id === id ? { ...o, favorito: !o.favorito } : o)))
  }

  // Funciones para eventos de agenda
  const agregarEvento = (evento: Omit<EventoAgenda, "id">) => {
    const nuevoEvento: EventoAgenda = {
      ...evento,
      id: generateId(),
    }
    setEventosAgenda([...eventosAgenda, nuevoEvento])
  }

  const actualizarEvento = (id: string, evento: Partial<EventoAgenda>) => {
    setEventosAgenda(eventosAgenda.map((e) => (e.id === id ? { ...e, ...evento } : e)))
  }

  const eliminarEvento = (id: string) => {
    setEventosAgenda(eventosAgenda.filter((e) => e.id !== id))
  }

  // Funciones para preferencias de estilo
  const actualizarPreferenciasEstilo = (preferencias: Partial<PreferenciasEstilo>) => {
    setPreferenciasEstilo({ ...preferenciasEstilo, ...preferencias })
  }

  // Funciones para configuración de usuario
  const actualizarConfiguracion = (config: Partial<ConfiguracionUsuario>) => {
    setConfiguracionUsuario({ ...configuracionUsuario, ...config })
  }

  // Funciones para chat
  const iniciarNuevaConversacion = () => {
    const nuevaConversacion: Conversacion = {
      id: generateId(),
      titulo: "Nueva conversación",
      mensajes: [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }
    setConversaciones([nuevaConversacion, ...conversaciones])
    setConversacionActual(nuevaConversacion)
  }

  const seleccionarConversacion = (id: string) => {
    const conversacion = conversaciones.find((c) => c.id === id)
    if (conversacion) {
      setConversacionActual(conversacion)
    }
  }

  const enviarMensaje = (contenido: string) => {
    if (!conversacionActual) {
      iniciarNuevaConversacion()
      return
    }

    const nuevoMensaje: Mensaje = {
      id: generateId(),
      role: "user",
      content: contenido,
      timestamp: new Date().toISOString(),
    }

    // Actualizar la conversación actual con el nuevo mensaje
    const conversacionActualizada = {
      ...conversacionActual,
      mensajes: [...conversacionActual.mensajes, nuevoMensaje],
      fechaActualizacion: new Date().toISOString(),
    }

    // Si es el primer mensaje, actualizar el título
    if (conversacionActual.mensajes.length === 0) {
      conversacionActualizada.titulo = contenido.length > 30 ? contenido.substring(0, 30) + "..." : contenido
    }

    setConversacionActual(conversacionActualizada)

    // Actualizar la lista de conversaciones
    setConversaciones(conversaciones.map((c) => (c.id === conversacionActual.id ? conversacionActualizada : c)))

    // Simular respuesta del asistente
    setTimeout(() => {
      const respuesta = generarRespuestaAsistente(contenido)
      const mensajeAsistente: Mensaje = {
        id: generateId(),
        role: "assistant",
        content: respuesta,
        timestamp: new Date().toISOString(),
      }

      const conversacionConRespuesta = {
        ...conversacionActualizada,
        mensajes: [...conversacionActualizada.mensajes, mensajeAsistente],
        fechaActualizacion: new Date().toISOString(),
      }

      setConversacionActual(conversacionConRespuesta)
      setConversaciones(conversaciones.map((c) => (c.id === conversacionActual.id ? conversacionConRespuesta : c)))
    }, 1000)
  }

  const eliminarConversacion = (id: string) => {
    setConversaciones(conversaciones.filter((c) => c.id !== id))

    // Si la conversación actual es la que se elimina, seleccionar otra
    if (conversacionActual && conversacionActual.id === id) {
      const primeraConversacion = conversaciones.find((c) => c.id !== id)
      setConversacionActual(primeraConversacion || null)
    }
  }

  // Función para generar respuestas del asistente (simulación)
  const generarRespuestaAsistente = (mensaje: string): string => {
    const mensajeLower = mensaje.toLowerCase()

    if (mensajeLower.includes("hola") || mensajeLower.includes("buenos días") || mensajeLower.includes("buenas")) {
      return "¡Hola! Soy tu asistente de moda personal. ¿En qué puedo ayudarte hoy?"
    }

    if (mensajeLower.includes("outfit") || mensajeLower.includes("vestir") || mensajeLower.includes("poner")) {
      return "Basado en tu armario, te recomendaría combinar tu camisa blanca con los jeans azules y la chaqueta marrón para un look casual pero elegante. ¿Te gustaría ver más opciones?"
    }

    if (mensajeLower.includes("formal") || mensajeLower.includes("elegante") || mensajeLower.includes("fiesta")) {
      return "Para una ocasión formal, tu vestido negro sería perfecto. Puedes combinarlo con zapatos de tacón y accesorios minimalistas para un look sofisticado."
    }

    if (mensajeLower.includes("casual") || mensajeLower.includes("diario") || mensajeLower.includes("día a día")) {
      return "Para un look casual, te sugiero los jeans azules con la blusa floral y unos zapatos cómodos. Es un conjunto versátil que puedes usar en diferentes situaciones."
    }

    if (mensajeLower.includes("trabajo") || mensajeLower.includes("oficina") || mensajeLower.includes("reunión")) {
      return "Para el trabajo, la combinación de camisa blanca, pantalón formal y zapatos elegantes es siempre una buena opción. Puedes añadir la chaqueta marrón si hace frío."
    }

    if (
      mensajeLower.includes("clima") ||
      mensajeLower.includes("frío") ||
      mensajeLower.includes("calor") ||
      mensajeLower.includes("lluvia")
    ) {
      return "Para días fríos, te recomendaría capas: suéter beige, chaqueta marrón y jeans. Para días calurosos, la blusa floral con la falda plisada sería ideal."
    }

    return "Entiendo tu consulta sobre moda. Basándome en tu armario y preferencias, puedo recomendarte varias opciones. ¿Te gustaría que te sugiera algo específico para alguna ocasión?"
  }

  const value = {
    // Datos
    prendas,
    outfits,
    eventosAgenda,
    preferenciasEstilo,
    configuracionUsuario,
    conversaciones,
    conversacionActual,

    // Funciones para prendas
    agregarPrenda,
    actualizarPrenda,
    eliminarPrenda,
    toggleFavoritoPrenda,

    // Funciones para outfits
    agregarOutfit,
    actualizarOutfit,
    eliminarOutfit,
    toggleFavoritoOutfit,

    // Funciones para eventos de agenda
    agregarEvento,
    actualizarEvento,
    eliminarEvento,

    // Funciones para preferencias de estilo
    actualizarPreferenciasEstilo,

    // Funciones para configuración de usuario
    actualizarConfiguracion,

    // Funciones para chat
    iniciarNuevaConversacion,
    seleccionarConversacion,
    enviarMensaje,
    eliminarConversacion,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext debe ser usado dentro de un AppProvider")
  }
  return context
}
