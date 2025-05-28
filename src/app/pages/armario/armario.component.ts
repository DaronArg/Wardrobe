import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatTabsModule } from "@angular/material/tabs"
import { MatChipsModule } from "@angular/material/chips"
import { MatIconModule } from "@angular/material/icon"
import { MatDialogModule, type MatDialog } from "@angular/material/dialog"
import { IconComponent } from "../../components/icon/icon.component"
import type { DataService } from "../../services/data.service"
import type { Prenda } from "../../models/types"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-armario",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    IconComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-xl font-bold text-mahogany tracking-wide vintage-header">Mi Armario</h1>
        <button 
          mat-raised-button 
          class="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm"
          (click)="abrirDialogoNuevaPrenda()"
        >
          <app-icon name="plus" [size]="16" class="mr-2"></app-icon>
          Añadir prenda
        </button>
      </div>

      <!-- Filtros -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <app-icon name="search" [size]="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></app-icon>
          <mat-form-field class="w-full" appearance="outline">
            <input 
              matInput 
              placeholder="Buscar prendas..."
              [(ngModel)]="searchTerm"
              class="border-cypress vintage-border bg-aloe/30 text-sm pl-9 pr-9"
            >
            <button 
              *ngIf="searchTerm" 
              matSuffix 
              mat-icon-button 
              (click)="searchTerm = ''"
            >
              <app-icon name="x" [size]="12"></app-icon>
            </button>
          </mat-form-field>
        </div>
        <div class="flex gap-2">
          <button 
            mat-icon-button 
            class="border-cypress vintage-border bg-aloe/30"
          >
            <app-icon name="filter" [size]="16" class="text-cypress"></app-icon>
          </button>
          <button 
            mat-icon-button 
            [class.bg-cypress]="viewMode === 'grid'"
            [class.text-vanilla]="viewMode === 'grid'"
            [class.border-cypress]="viewMode !== 'grid'"
            [class.vintage-border]="viewMode !== 'grid'"
            [class.bg-aloe/30]="viewMode !== 'grid'"
            (click)="viewMode = 'grid'"
          >
            <app-icon name="grid3x3" [size]="16"></app-icon>
          </button>
          <button 
            mat-icon-button 
            [class.bg-cypress]="viewMode === 'list'"
            [class.text-vanilla]="viewMode === 'list'"
            [class.border-cypress]="viewMode !== 'list'"
            [class.vintage-border]="viewMode !== 'list'"
            [class.bg-aloe/30]="viewMode !== 'list'"
            (click)="viewMode = 'list'"
          >
            <app-icon name="list" [size]="16"></app-icon>
          </button>
        </div>
      </div>

      <!-- Tabs de categorías -->
      <mat-tab-group 
        [(selectedIndex)]="selectedTabIndex" 
        class="bg-sand/70 border border-cypress/40 text-sm"
      >
        <mat-tab 
          *ngFor="let categoria of categoriasDisponibles; let i = index" 
          [label]="categoria"
        >
          <!-- Grid view -->
          <div 
            *ngIf="viewMode === 'grid'" 
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
          >
            <mat-card 
              *ngFor="let prenda of prendasFiltradas" 
              class="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <div class="aspect-square relative bg-vanilla/50">
                <img 
                  [src]="prenda.imagen || '/assets/placeholder.svg'" 
                  [alt]="prenda.nombre"
                  class="object-cover w-full h-full"
                >
                <div class="absolute top-2 right-2 flex gap-1">
                  <button 
                    mat-icon-button 
                    class="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                    (click)="toggleFavorito(prenda.id)"
                  >
                    <app-icon 
                      name="heart" 
                      [size]="16"
                      [class.text-red-500]="prenda.favorito"
                      [class.fill-current]="prenda.favorito"
                      [class.text-gray-500]="!prenda.favorito"
                    ></app-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    class="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                    (click)="editarPrenda(prenda)"
                  >
                    <app-icon name="edit" [size]="16" class="text-gray-500"></app-icon>
                  </button>
                  <button 
                    mat-icon-button 
                    class="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                    (click)="eliminarPrenda(prenda.id)"
                  >
                    <app-icon name="trash2" [size]="16" class="text-gray-500"></app-icon>
                  </button>
                </div>
              </div>
              <mat-card-content class="p-4">
                <h3 class="font-medium text-mahogany font-serif text-sm">{{ prenda.nombre }}</h3>
                <div class="flex gap-2 mt-2">
                  <mat-chip class="bg-sand text-mahogany border-tobacco text-xs">
                    {{ prenda.categoria }}
                  </mat-chip>
                  <mat-chip class="bg-aloe text-cypress border-olive text-xs">
                    {{ prenda.color }}
                  </mat-chip>
                </div>
                <p *ngIf="prenda.precio" class="text-xs text-gray-600 mt-2">
                  {{ formatPrice(prenda.precio) }}
                </p>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- List view -->
          <div *ngIf="viewMode === 'list'" class="space-y-3 mt-6">
            <mat-card 
              *ngFor="let prenda of prendasFiltradas" 
              class="border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <mat-card-content class="p-4">
                <div class="flex gap-4 items-center">
                  <div class="w-16 h-16 bg-vanilla/50 rounded-md overflow-hidden flex-shrink-0 border border-cypress/30">
                    <img 
                      [src]="prenda.imagen || '/assets/placeholder.svg'" 
                      [alt]="prenda.nombre"
                      class="object-cover w-full h-full"
                    >
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <h3 class="font-medium text-mahogany font-serif text-sm">{{ prenda.nombre }}</h3>
                      <div class="flex gap-1">
                        <button 
                          mat-icon-button 
                          class="h-7 w-7"
                          (click)="toggleFavorito(prenda.id)"
                        >
                          <app-icon 
                            name="heart" 
                            [size]="16"
                            [class.text-red-500]="prenda.favorito"
                            [class.fill-current]="prenda.favorito"
                            [class.text-gray-500]="!prenda.favorito"
                          ></app-icon>
                        </button>
                        <button 
                          mat-icon-button 
                          class="h-7 w-7"
                          (click)="editarPrenda(prenda)"
                        >
                          <app-icon name="edit" [size]="16" class="text-gray-500"></app-icon>
                        </button>
                        <button 
                          mat-icon-button 
                          class="h-7 w-7"
                          (click)="eliminarPrenda(prenda.id)"
                        >
                          <app-icon name="trash2" [size]="16" class="text-gray-500"></app-icon>
                        </button>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <mat-chip class="bg-sand text-mahogany border-tobacco text-xs">
                        {{ prenda.categoria }}
                      </mat-chip>
                      <mat-chip class="bg-aloe text-cypress border-olive text-xs">
                        {{ prenda.color }}
                      </mat-chip>
                      <mat-chip 
                        *ngIf="prenda.precio" 
                        class="bg-transparent border-gray-300 text-gray-600 text-xs"
                      >
                        {{ formatPrice(prenda.precio) }}
                      </mat-chip>
                    </div>
                    <div class="mt-1 text-xs text-gray-600">
                      <span>Temporadas: </span>
                      {{ prenda.temporada.join(', ') }}
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Estado vacío -->
          <div 
            *ngIf="prendasFiltradas.length === 0" 
            class="flex flex-col items-center justify-center p-8 text-gray-600 bg-aloe/20 border border-cypress/20 rounded-lg mt-6"
          >
            <p class="mb-4">No se encontraron prendas con los filtros seleccionados</p>
            <button 
              mat-stroked-button 
              class="border-cypress text-cypress"
              (click)="limpiarFiltros()"
            >
              Limpiar filtros
            </button>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class ArmarioComponent implements OnInit, OnDestroy {
  prendas: Prenda[] = []
  searchTerm = ""
  viewMode: "grid" | "list" = "grid"
  selectedTabIndex = 0

  categoriasDisponibles = [
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

  private destroy$ = new Subject<void>()

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.dataService.prendas$.pipe(takeUntil(this.destroy$)).subscribe((prendas) => {
      this.prendas = prendas
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get prendasFiltradas(): Prenda[] {
    let filtradas = this.prendas

    // Filtro por categoría
    const categoriaSeleccionada = this.categoriasDisponibles[this.selectedTabIndex]
    if (categoriaSeleccionada !== "Todas") {
      filtradas = filtradas.filter((p) => p.categoria === categoriaSeleccionada)
    }

    // Filtro por búsqueda
    if (this.searchTerm) {
      const termino = this.searchTerm.toLowerCase()
      filtradas = filtradas.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.categoria.toLowerCase().includes(termino) ||
          p.color.toLowerCase().includes(termino),
      )
    }

    return filtradas
  }

  toggleFavorito(id: string) {
    this.dataService.toggleFavoritoPrenda(id)
  }

  editarPrenda(prenda: Prenda) {
    // TODO: Implementar diálogo de edición
    console.log("Editar prenda:", prenda)
  }

  eliminarPrenda(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar esta prenda?")) {
      this.dataService.eliminarPrenda(id)
    }
  }

  abrirDialogoNuevaPrenda() {
    // TODO: Implementar diálogo de nueva prenda
    console.log("Abrir diálogo nueva prenda")
  }

  limpiarFiltros() {
    this.searchTerm = ""
    this.selectedTabIndex = 0
  }

  formatPrice(price: number): string {
    return price.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
    })
  }
}
