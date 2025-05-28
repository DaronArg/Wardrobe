import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import type {
  Prenda,
  Outfit,
  EventoAgenda,
  PreferenciasEstilo,
  ConfiguracionUsuario,
  Conversacion,
  Mensaje,
} from "../models/types"

@Injectable({
  providedIn: "root",
})
export class DataService {
  // Datos iniciales
  private prendasData: Prenda[] = [
    {
      id: "p1",
      nombre: "Camisa blanca",
      categoria: "Camisas",
      color: "Blanco",
      temporada: ["Primavera", "Verano", "Otoño"],
      ocasiones: ["Formal", "Trabajo", "Casual"],
      imagen: "/assets/white-shirt.png",
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
      imagen: "/assets/classic-blue-jeans.png",
      fechaCompra: "2023-11-20",
      marca: "Levi's",
      precio: 59.99,
      favorito: true,
      notas: "Jeans clásicos, corte recto",
    },
  ]

  private outfitsData: Outfit[] = [
    {
      id: "o1",
      nombre: "Casual de oficina",
      ocasion: "Trabajo",
      temporada: ["Primavera", "Otoño"],
      prendas: ["p1", "p2"],
      imagen: "/assets/business-casual-outfit.png",
      fechaCreacion: "2024-03-15",
      favorito: true,
      notas: "Perfecto para días de oficina",
    },
  ]

  private eventosAgendaData: EventoAgenda[] = [
    {
      id: "e1",
      titulo: "Reunión de trabajo",
      fecha: "2025-05-25",
      outfitId: "o1",
      notas: "Presentación importante",
      recordatorio: true,
    },
  ]

  private preferenciasEstiloData: PreferenciasEstilo = {
    coloresFavoritos: ["Beige", "Blanco", "Negro", "Azul"],
    estampados: ["Liso", "Rayas sutiles"],
    prendasFavoritas: ["Camisas", "Jeans", "Vestidos midi"],
    ocasionesFrecuentes: ["Trabajo", "Casual", "Cenas informales"],
    estiloPersonal: "Casual elegante con toques minimalistas",
  }

  private configuracionUsuarioData: ConfiguracionUsuario = {
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

  private conversacionesData: Conversacion[] = [
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
            "Para una cena casual, te recomendaría combinar tus jeans azules con la blusa floral y unos zapatos cómodos.",
          timestamp: "2025-05-20T18:30:30Z",
        },
      ],
      fechaCreacion: "2025-05-20T18:30:00Z",
      fechaActualizacion: "2025-05-20T18:31:30Z",
    },
  ]

  // BehaviorSubjects para estado reactivo
  private prendasSubject = new BehaviorSubject<Prenda[]>(this.prendasData)
  private outfitsSubject = new BehaviorSubject<Outfit[]>(this.outfitsData)
  private eventosAgendaSubject = new BehaviorSubject<EventoAgenda[]>(this.eventosAgendaData)
  private preferenciasEstiloSubject = new BehaviorSubject<PreferenciasEstilo>(this.preferenciasEstiloData)
  private configuracionUsuarioSubject = new BehaviorSubject<ConfiguracionUsuario>(this.configuracionUsuarioData)
  private conversacionesSubject = new BehaviorSubject<Conversacion[]>(this.conversacionesData)
  private conversacionActualSubject = new BehaviorSubject<Conversacion | null>(this.conversacionesData[0] || null)

  // Observables públicos
  prendas$ = this.prendasSubject.asObservable()
  outfits$ = this.outfitsSubject.asObservable()
  eventosAgenda$ = this.eventosAgendaSubject.asObservable()
  preferenciasEstilo$ = this.preferenciasEstiloSubject.asObservable()
  configuracionUsuario$ = this.configuracionUsuarioSubject.asObservable()
  conversaciones$ = this.conversacionesSubject.asObservable()
  conversacionActual$ = this.conversacionActualSubject.asObservable()

  // Métodos para prendas
  agregarPrenda(prenda: Omit<Prenda, "id">): void {
    const nuevaPrenda: Prenda = {
      ...prenda,
      id: this.generateId(),
    }
    const prendas = [...this.prendasSubject.value, nuevaPrenda]
    this.prendasSubject.next(prendas)
  }

  actualizarPrenda(id: string, prenda: Partial<Prenda>): void {
    const prendas = this.prendasSubject.value.map((p) => (p.id === id ? { ...p, ...prenda } : p))
    this.prendasSubject.next(prendas)
  }

  eliminarPrenda(id: string): void {
    const prendas = this.prendasSubject.value.filter((p) => p.id !== id)
    this.prendasSubject.next(prendas)
  }

  toggleFavoritoPrenda(id: string): void {
    const prendas = this.prendasSubject.value.map((p) => (p.id === id ? { ...p, favorito: !p.favorito } : p))
    this.prendasSubject.next(prendas)
  }

  // Métodos para outfits
  agregarOutfit(outfit: Omit<Outfit, "id" | "fechaCreacion">): void {
    const nuevoOutfit: Outfit = {
      ...outfit,
      id: this.generateId(),
      fechaCreacion: new Date().toISOString(),
    }
    const outfits = [...this.outfitsSubject.value, nuevoOutfit]
    this.outfitsSubject.next(outfits)
  }

  actualizarOutfit(id: string, outfit: Partial<Outfit>): void {
    const outfits = this.outfitsSubject.value.map((o) => (o.id === id ? { ...o, ...outfit } : o))
    this.outfitsSubject.next(outfits)
  }

  eliminarOutfit(id: string): void {
    const outfits = this.outfitsSubject.value.filter((o) => o.id !== id)
    this.outfitsSubject.next(outfits)
  }

  toggleFavoritoOutfit(id: string): void {
    const outfits = this.outfitsSubject.value.map((o) => (o.id === id ? { ...o, favorito: !o.favorito } : o))
    this.outfitsSubject.next(outfits)
  }

  // Métodos para eventos de agenda
  agregarEvento(evento: Omit<EventoAgenda, "id">): void {
    const nuevoEvento: EventoAgenda = {
      ...evento,
      id: this.generateId(),
    }
    const eventos = [...this.eventosAgendaSubject.value, nuevoEvento]
    this.eventosAgendaSubject.next(eventos)
  }

  actualizarEvento(id: string, evento: Partial<EventoAgenda>): void {
    const eventos = this.eventosAgendaSubject.value.map((e) => (e.id === id ? { ...e, ...evento } : e))
    this.eventosAgendaSubject.next(eventos)
  }

  eliminarEvento(id: string): void {
    const eventos = this.eventosAgendaSubject.value.filter((e) => e.id !== id)
    this.eventosAgendaSubject.next(eventos)
  }

  // Métodos para chat
  enviarMensaje(contenido: string): void {
    let conversacionActual = this.conversacionActualSubject.value

    if (!conversacionActual) {
      this.iniciarNuevaConversacion()
      conversacionActual = this.conversacionActualSubject.value
    }

    if (!conversacionActual) return

    const nuevoMensaje: Mensaje = {
      id: this.generateId(),
      role: "user",
      content: contenido,
      timestamp: new Date().toISOString(),
    }

    const conversacionActualizada = {
      ...conversacionActual,
      mensajes: [...conversacionActual.mensajes, nuevoMensaje],
      fechaActualizacion: new Date().toISOString(),
    }

    if (conversacionActual.mensajes.length === 0) {
      conversacionActualizada.titulo = contenido.length > 30 ? contenido.substring(0, 30) + "..." : contenido
    }

    this.conversacionActualSubject.next(conversacionActualizada)
    this.actualizarConversacionEnLista(conversacionActualizada)

    // Simular respuesta del asistente
    setTimeout(() => {
      const respuesta = this.generarRespuestaAsistente(contenido)
      const mensajeAsistente: Mensaje = {
        id: this.generateId(),
        role: "assistant",
        content: respuesta,
        timestamp: new Date().toISOString(),
      }

      const conversacionConRespuesta = {
        ...conversacionActualizada,
        mensajes: [...conversacionActualizada.mensajes, mensajeAsistente],
        fechaActualizacion: new Date().toISOString(),
      }

      this.conversacionActualSubject.next(conversacionConRespuesta)
      this.actualizarConversacionEnLista(conversacionConRespuesta)
    }, 1000)
  }

  iniciarNuevaConversacion(): void {
    const nuevaConversacion: Conversacion = {
      id: this.generateId(),
      titulo: "Nueva conversación",
      mensajes: [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    const conversaciones = [nuevaConversacion, ...this.conversacionesSubject.value]
    this.conversacionesSubject.next(conversaciones)
    this.conversacionActualSubject.next(nuevaConversacion)
  }

  seleccionarConversacion(id: string): void {
    const conversacion = this.conversacionesSubject.value.find((c) => c.id === id)
    if (conversacion) {
      this.conversacionActualSubject.next(conversacion)
    }
  }

  eliminarConversacion(id: string): void {
    const conversaciones = this.conversacionesSubject.value.filter((c) => c.id !== id)
    this.conversacionesSubject.next(conversaciones)

    const conversacionActual = this.conversacionActualSubject.value
    if (conversacionActual && conversacionActual.id === id) {
      const primeraConversacion = conversaciones[0] || null
      this.conversacionActualSubject.next(primeraConversacion)
    }
  }

  private actualizarConversacionEnLista(conversacion: Conversacion): void {
    const conversaciones = this.conversacionesSubject.value.map((c) => (c.id === conversacion.id ? conversacion : c))
    this.conversacionesSubject.next(conversaciones)
  }

  private generarRespuestaAsistente(mensaje: string): string {
    const mensajeLower = mensaje.toLowerCase()

    if (mensajeLower.includes("hola") || mensajeLower.includes("buenos días")) {
      return "¡Hola! Soy tu asistente de moda personal. ¿En qué puedo ayudarte hoy?"
    }

    if (mensajeLower.includes("outfit") || mensajeLower.includes("vestir")) {
      return "Basado en tu armario, te recomendaría combinar tu camisa blanca con los jeans azules para un look casual pero elegante."
    }

    if (mensajeLower.includes("formal") || mensajeLower.includes("elegante")) {
      return "Para una ocasión formal, tu vestido negro sería perfecto. Puedes combinarlo con zapatos de tacón y accesorios minimalistas."
    }

    return "Entiendo tu consulta sobre moda. Basándome en tu armario y preferencias, puedo recomendarte varias opciones. ¿Te gustaría que te sugiera algo específico?"
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9)
  }
}
