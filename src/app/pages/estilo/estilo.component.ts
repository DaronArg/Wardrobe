import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import  { DataService } from "../../services/data.service"
import type { PreferenciasEstilo, Estadisticas } from "../../models/types"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-estilo",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatProgressBarModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-xl font-bold text-mahogany tracking-wide vintage-header">Mi Estilo</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Perfil de estilo -->
        <mat-card class="border-tobacco vintage-card">
          <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
            <mat-card-title class="text-mahogany">Perfil de estilo</mat-card-title>
            <mat-card-subtitle class="text-tobacco">Tu estilo personal definido</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6">
            <p class="text-lg font-medium text-mahogany mb-4">
              {{ preferenciasEstilo?.estiloPersonal }}
            </p>

            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-mahogany mb-2">Colores favoritos</h3>
                <div class="flex flex-wrap gap-2">
                  <mat-chip 
                    *ngFor="let color of preferenciasEstilo?.coloresFavoritos" 
                    class="bg-cypress text-vanilla text-xs"
                  >
                    {{ color }}
                  </mat-chip>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-mahogany mb-2">Estampados preferidos</h3>
                <div class="flex flex-wrap gap-2">
                  <mat-chip 
                    *ngFor="let estampado of preferenciasEstilo?.estampados" 
                    class="bg-cypress text-vanilla text-xs"
                  >
                    {{ estampado }}
                  </mat-chip>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-mahogany mb-2">Prendas favoritas</h3>
                <div class="flex flex-wrap gap-2">
                  <mat-chip 
                    *ngFor="let prenda of preferenciasEstilo?.prendasFavoritas" 
                    class="bg-cypress text-vanilla text-xs"
                  >
                    {{ prenda }}
                  </mat-chip>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-medium text-mahogany mb-2">Ocasiones frecuentes</h3>
                <div class="flex flex-wrap gap-2">
                  <mat-chip 
                    *ngFor="let ocasion of preferenciasEstilo?.ocasionesFrecuentes" 
                    class="bg-cypress text-vanilla text-xs"
                  >
                    {{ ocasion }}
                  </mat-chip>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Estadísticas de armario -->
        <mat-card class="border-tobacco vintage-card">
          <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
            <mat-card-title class="text-mahogany">Estadísticas de armario</mat-card-title>
            <mat-card-subtitle class="text-tobacco">Distribución de tus prendas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="p-6">
            <div class="space-y-4">
              <div *ngFor="let stat of estadisticas" class="space-y-1">
                <div class="flex justify-between text-sm">
                  <span class="font-medium text-mahogany">{{ stat.categoria }}</span>
                  <span class="text-gray-600 font-medium">{{ stat.cantidad }} prendas</span>
                </div>
                <mat-progress-bar 
                  [value]="stat.porcentaje" 
                  class="h-2"
                  color="primary"
                ></mat-progress-bar>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Combinaciones populares -->
      <mat-card class="border-tobacco vintage-card">
        <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
          <mat-card-title class="text-mahogany">Combinaciones populares</mat-card-title>
          <mat-card-subtitle class="text-tobacco">Tus combinaciones más utilizadas</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content class="p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              *ngFor="let combo of combinacionesPopulares" 
              class="flex items-center p-3 border border-cypress/50 rounded-md vintage-card"
            >
              <div class="flex-1">
                <p class="font-medium text-mahogany">{{ combo.nombre }}</p>
              </div>
              <mat-chip 
                [class]="getFrecuenciaClass(combo.frecuencia)"
              >
                {{ combo.frecuencia }}
              </mat-chip>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class EstiloComponent implements OnInit, OnDestroy {
  preferenciasEstilo: PreferenciasEstilo | null = null
  estadisticas: Estadisticas[] = []
  combinacionesPopulares = [
    { nombre: "Camisa blanca + Jeans azules", frecuencia: "Alta" as const },
    { nombre: "Vestido negro + Tacones", frecuencia: "Media" as const },
    { nombre: "Suéter beige + Pantalón marrón", frecuencia: "Alta" as const },
    { nombre: "Blusa floral + Falda lisa", frecuencia: "Baja" as const },
  ]

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.preferenciasEstilo$.pipe(takeUntil(this.destroy$)).subscribe((preferencias) => {
      this.preferenciasEstilo = preferencias
    })

    this.dataService.prendas$.pipe(takeUntil(this.destroy$)).subscribe((prendas) => {
      this.estadisticas = this.calcularEstadisticas(prendas)
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private calcularEstadisticas(prendas: any[]): Estadisticas[] {
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

  getFrecuenciaClass(frecuencia: "Alta" | "Media" | "Baja"): string {
    switch (frecuencia) {
      case "Alta":
        return "bg-cypress text-vanilla"
      case "Media":
        return "bg-olive text-vanilla"
      case "Baja":
        return "bg-aloe text-cypress"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }
}
