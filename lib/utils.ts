import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Prenda, Outfit, EventoAgenda } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generar ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Formatear fecha
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

// Formatear precio
export function formatPrice(price?: number): string {
  if (!price) return ""
  return price.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

// Filtrar prendas por categoría
export function filtrarPrendasPorCategoria(prendas: Prenda[], categoria: string): Prenda[] {
  if (categoria === "Todas") return prendas
  return prendas.filter((prenda) => prenda.categoria === categoria)
}

// Filtrar prendas por búsqueda
export function filtrarPrendasPorBusqueda(prendas: Prenda[], busqueda: string): Prenda[] {
  if (!busqueda) return prendas
  const terminoBusqueda = busqueda.toLowerCase()
  return prendas.filter(
    (prenda) =>
      prenda.nombre.toLowerCase().includes(terminoBusqueda) ||
      prenda.categoria.toLowerCase().includes(terminoBusqueda) ||
      prenda.color.toLowerCase().includes(terminoBusqueda) ||
      prenda.marca?.toLowerCase().includes(terminoBusqueda) ||
      prenda.temporada.some((t) => t.toLowerCase().includes(terminoBusqueda)) ||
      prenda.ocasiones.some((o) => o.toLowerCase().includes(terminoBusqueda)),
  )
}

// Obtener prendas favoritas
export function obtenerPrendasFavoritas(prendas: Prenda[]): Prenda[] {
  return prendas.filter((prenda) => prenda.favorito)
}

// Obtener outfits favoritos
export function obtenerOutfitsFavoritos(outfits: Outfit[]): Outfit[] {
  return outfits.filter((outfit) => outfit.favorito)
}

// Obtener eventos para una fecha específica
export function obtenerEventosPorFecha(eventos: EventoAgenda[], fecha: string): EventoAgenda[] {
  return eventos.filter((evento) => evento.fecha === fecha)
}

// Obtener prendas de un outfit
export function obtenerPrendasDeOutfit(outfit: Outfit, prendas: Prenda[]): Prenda[] {
  return prendas.filter((prenda) => outfit.prendas.includes(prenda.id))
}

// Generar recomendación de outfit basada en ocasión y temporada
export function generarRecomendacionOutfit(prendas: Prenda[], ocasion: string, temporada: string): Prenda[] {
  // Filtrar prendas por ocasión y temporada
  const prendasFiltradas = prendas.filter(
    (prenda) => prenda.ocasiones.includes(ocasion) && prenda.temporada.includes(temporada),
  )

  // Categorías básicas para un outfit
  const categorias = ["Camisas", "Blusas", "Pantalones", "Faldas", "Vestidos", "Calzado"]

  // Seleccionar una prenda por categoría
  const outfit: Prenda[] = []

  // Si hay un vestido, no necesitamos parte superior ni inferior
  const vestido = prendasFiltradas.find((p) => p.categoria === "Vestidos")
  if (vestido) {
    outfit.push(vestido)
    // Añadir calzado
    const calzado = prendasFiltradas.find((p) => p.categoria === "Calzado")
    if (calzado) outfit.push(calzado)
    return outfit
  }

  // Parte superior (camisa o blusa)
  const partesSuperior = prendasFiltradas.filter((p) => p.categoria === "Camisas" || p.categoria === "Blusas")
  if (partesSuperior.length > 0) {
    outfit.push(partesSuperior[Math.floor(Math.random() * partesSuperior.length)])
  }

  // Parte inferior (pantalón o falda)
  const partesInferior = prendasFiltradas.filter((p) => p.categoria === "Pantalones" || p.categoria === "Faldas")
  if (partesInferior.length > 0) {
    outfit.push(partesInferior[Math.floor(Math.random() * partesInferior.length)])
  }

  // Calzado
  const calzado = prendasFiltradas.find((p) => p.categoria === "Calzado")
  if (calzado) outfit.push(calzado)

  return outfit
}

// Obtener estadísticas de armario
export function obtenerEstadisticasArmario(
  prendas: Prenda[],
): { categoria: string; cantidad: number; porcentaje: number }[] {
  const categorias = [...new Set(prendas.map((p) => p.categoria))]
  const total = prendas.length

  return categorias
    .map((categoria) => {
      const cantidad = prendas.filter((p) => p.categoria === categoria).length
      const porcentaje = (cantidad / total) * 100
      return { categoria, cantidad, porcentaje }
    })
    .sort((a, b) => b.cantidad - a.cantidad)
}

// Obtener combinaciones populares
export function obtenerCombinacionesPopulares(
  outfits: Outfit[],
): { nombre: string; frecuencia: "Alta" | "Media" | "Baja"; prendas: string[] }[] {
  // Contar frecuencia de combinaciones de prendas
  const combinaciones: Record<string, { count: number; prendas: string[] }> = {}

  outfits.forEach((outfit) => {
    // Considerar combinaciones de 2 prendas
    for (let i = 0; i < outfit.prendas.length; i++) {
      for (let j = i + 1; j < outfit.prendas.length; j++) {
        const prenda1 = outfit.prendas[i]
        const prenda2 = outfit.prendas[j]
        const key = [prenda1, prenda2].sort().join("-")

        if (!combinaciones[key]) {
          combinaciones[key] = { count: 0, prendas: [prenda1, prenda2] }
        }
        combinaciones[key].count++
      }
    }
  })

  // Convertir a array y ordenar por frecuencia
  const combinacionesArray = Object.entries(combinaciones)
    .map(([key, { count, prendas }]) => ({
      nombre: key,
      count,
      prendas,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5 combinaciones

  // Asignar nivel de frecuencia
  return combinacionesArray.map((c) => {
    let frecuencia: "Alta" | "Media" | "Baja" = "Baja"
    if (c.count >= 3) frecuencia = "Alta"
    else if (c.count >= 2) frecuencia = "Media"

    return {
      nombre: c.nombre,
      frecuencia,
      prendas: c.prendas,
    }
  })
}

// Obtener días del mes para el calendario
export function obtenerDiasMes(year: number, month: number): { day: number | null; date: string | null }[] {
  const date = new Date(year, month, 1)
  const days = []

  // Obtener el primer día de la semana del mes (0 = Domingo, 1 = Lunes, etc.)
  const firstDay = new Date(year, month, 1).getDay()

  // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  // Añadir días vacíos para alinear el calendario
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push({ day: null, date: null })
  }

  // Añadir todos los días del mes
  while (date.getMonth() === month) {
    const day = new Date(date).getDate()
    const dateStr = new Date(date).toISOString().split("T")[0]
    days.push({ day, date: dateStr })
    date.setDate(date.getDate() + 1)
  }

  return days
}
