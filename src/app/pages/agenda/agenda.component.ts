import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { IconComponent } from "../../components/icon/icon.component"
import type { DataService } from "../../services/data.service"
import type { EventoAgenda, Outfit } from "../../models/types"
import { Subject, takeUntil, combineLatest } from "rxjs"

@Component({
  selector: "app-agenda",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, IconComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-xl font-bold text-mahogany tracking-wide vintage-header">Agenda de Outfits</h1>
        <button 
          mat-raised-button 
          class="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm"
          (click)="añadirEvento()"
        >
          <app-icon name="plus" [size]="16" class="mr-2"></app-icon>
          Añadir evento
        </button>
      </div>

      <!-- Calendario -->
      <mat-card class="border-tobacco vintage-card">
        <mat-card-content class="p-6">
          <div class="flex items-center justify-between mb-6">
            <button 
              mat-icon-button 
              class="border-cypress"
              (click)="mesAnterior()"
            >
              <app-icon name="chevronLeft" [size]="16"></app-icon>
            </button>
            <h2 class="text-xl font-medium capitalize text-mahogany">
              {{ nombreMes }} {{ añoActual }}
            </h2>
            <button 
              mat-icon-button 
              class="border-cypress"
              (click)="mesSiguiente()"
            >
              <app-icon name="chevronRight" [size]="16"></app-icon>
            </button>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <div 
              *ngFor="let dia of diasSemana" 
              class="text-center font-medium text-sm py-2 text-mahogany"
            >
              {{ dia }}
            </div>

            <div 
              *ngFor="let dia of diasMes; let i = index"
              class="min-h-[80px] p-1 border border-cypress/30 relative"
              [class.bg-cypress/10]="esHoy(dia.fecha)"
              [class.bg-gray-100]="!dia.dia"
            >
              <span 
                *ngIf="dia.dia" 
                class="text-sm font-medium text-mahogany"
              >
                {{ dia.dia }}
              </span>

              <div 
                *ngIf="getEventoPorFecha(dia.fecha)" 
                class="mt-1 p-1 text-xs bg-cypress text-vanilla rounded relative"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-xs truncate">
                      {{ getEventoPorFecha(dia.fecha)?.titulo }}
                    </p>
                    <p 
                      *ngIf="getEventoPorFecha(dia.fecha)?.outfitId" 
                      class="text-xs truncate"
                    >
                      {{ getNombreOutfit(getEventoPorFecha(dia.fecha)?.outfitId) }}
                    </p>
                  </div>
                  <div class="flex gap-1 ml-1">
                    <button 
                      mat-icon-button 
                      class="h-4 w-4 p-0 text-vanilla hover:text-aloe"
                      (click)="editarEvento(getEventoPorFecha(dia.fecha)!)"
                    >
                      <app-icon name="edit" [size]="12"></app-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      class="h-4 w-4 p-0 text-vanilla hover:text-red-300"
                      (click)="eliminarEvento(getEventoPorFecha(dia.fecha)!.id)"
                    >
                      <app-icon name="trash2" [size]="12"></app-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Próximos eventos -->
      <div class="mt-6">
        <h3 class="text-lg font-medium text-mahogany mb-4">Próximos eventos</h3>
        <div class="space-y-3">
          <mat-card 
            *ngFor="let evento of proximosEventos" 
            class="border-cypress vintage-card"
          >
            <mat-card-content class="p-4 flex justify-between items-center">
              <div>
                <p class="font-medium text-mahogany">{{ evento.titulo }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(evento.fecha) }}</p>
                <p 
                  *ngIf="evento.outfitId" 
                  class="text-sm text-cypress font-medium"
                >
                  {{ getNombreOutfit(evento.outfitId) }}
                </p>
              </div>
              <div class="flex gap-2">
                <button 
                  mat-icon-button 
                  (click)="editarEvento(evento)"
                >
                  <app-icon name="edit" [size]="16"></app-icon>
                </button>
                <button 
                  mat-icon-button 
                  (click)="eliminarEvento(evento.id)"
                >
                  <app-icon name="trash2" [size]="16"></app-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
})
export class AgendaComponent implements OnInit, OnDestroy {
  eventos: EventoAgenda[] = []
  outfits: Outfit[] = []
  mesActual = new Date().getMonth()
  añoActual = new Date().getFullYear()

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
    return new Date(this.añoActual, this.mesActual).toLocaleString("es", { month: "long" })
  }

  get diasMes(): { dia: number | null; fecha: string | null }[] {
    const fecha = new Date(this.añoActual, this.mesActual, 1)
    const dias = []

    // Primer día de la semana del mes (0 = Domingo, 1 = Lunes, etc.)
    const primerDia = new Date(this.añoActual, this.mesActual, 1).getDay()
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
      this.añoActual--
    } else {
      this.mesActual--
    }
  }

  mesSiguiente() {
    if (this.mesActual === 11) {
      this.mesActual = 0
      this.añoActual++
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

  añadirEvento() {
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
