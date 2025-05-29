import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { IconComponent } from "../../components/icon/icon.component"
import  { DataService } from "../../services/data.service"
import type { EventoAgenda, Outfit } from "../../models/types"
import { Subject, takeUntil, combineLatest } from "rxjs"

@Component({
  selector: "app-agenda",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, IconComponent],
  
  templateUrl: "./agenda.component.html",
})
export class AgendaComponent implements OnInit, OnDestroy {
  eventos: EventoAgenda[] = []
  outfits: Outfit[] = []
  mesActual = new Date().getMonth()
  anoActual = new Date().getFullYear()

  diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    combineLatest([this.dataService.eventosAgenda$, this.dataService.outfits$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([eventos, outfits]) => {
        this.eventos = eventos
        this.outfits = outfits
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get nombreMes(): string {
    return new Date(this.anoActual, this.mesActual).toLocaleString("es", { month: "long" })
  }

  get diasMes(): { dia: number | null; fecha: string | null }[] {
    const fecha = new Date(this.anoActual, this.mesActual, 1)
    const dias = []

    // Primer día de la semana del mes (0 = Domingo, 1 = Lunes, etc.)
    const primerDia = new Date(this.anoActual, this.mesActual, 1).getDay()
    const primerDiaAjustado = primerDia === 0 ? 6 : primerDia - 1

    // Añadir días vacíos
    for (let i = 0; i < primerDiaAjustado; i++) {
      dias.push({ dia: null, fecha: null })
    }

    // Añadir días del mes
    while (fecha.getMonth() === this.mesActual) {
      const dia = new Date(fecha).getDate()
      const fechaStr = new Date(fecha).toISOString().split("T")[0]
      dias.push({ dia, fecha: fechaStr })
      fecha.setDate(fecha.getDate() + 1)
    }

    return dias
  }

  get proximosEventos(): EventoAgenda[] {
    return this.eventos
      .filter((evento) => new Date(evento.fecha) >= new Date())
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(0, 5)
  }

  mesAnterior() {
    if (this.mesActual === 0) {
      this.mesActual = 11
      this.anoActual--
    } else {
      this.mesActual--
    }
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0
      this.anoActual++
    } else {
      this.mesActual++
    }
  }

  esHoy(fecha: string | null): boolean {
    if (!fecha) return false
    return fecha === new Date().toISOString().split("T")[0]
  }

  getEventoPorFecha(fecha: string | null): EventoAgenda | null {
    if (!fecha) return null
    return this.eventos.find((evento) => evento.fecha === fecha) || null
  }

  getNombreOutfit(outfitId?: string): string {
    if (!outfitId) return ""
    const outfit = this.outfits.find((o) => o.id === outfitId)
    return outfit ? outfit.nombre : "Outfit no encontrado"
  }

  anadirEvento() {
    // TODO: Implementar diálogo de nuevo evento
    console.log("Añadir evento")
  }

  editarEvento(evento: EventoAgenda) {
    // TODO: Implementar diálogo de edición
    console.log("Editar evento:", evento)
  }

  eliminarEvento(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar este evento?")) {
      this.dataService.eliminarEvento(id)
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }
}
