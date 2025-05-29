import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatChipsModule } from "@angular/material/chips"
import { MatIconModule } from "@angular/material/icon"
import { IconComponent } from "../../components/icon/icon.component"
import  { DataService } from "../../services/data.service"
import type { Outfit, Prenda } from "../../models/types"
import { Subject, takeUntil, combineLatest } from "rxjs"

@Component({
  selector: "app-outfits",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    IconComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 class="text-xl font-bold text-mahogany font-serif tracking-wide vintage-header">Mis Outfits</h1>
        <button 
          mat-raised-button 
          class="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm"
          (click)="crearOutfit()"
        >
          <app-icon name="plus" [size]="16" class="mr-2"></app-icon>
          Crear outfit
        </button>
      </div>

      <!-- Filtros -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <mat-form-field class="w-full" appearance="outline">
            <input 
              matInput 
              placeholder="Buscar outfits..."
              [(ngModel)]="searchTerm"
              class="border-cypress vintage-border bg-aloe/30 text-sm"
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
        <button 
          mat-icon-button 
          class="border-cypress vintage-border bg-aloe/30"
        >
          <app-icon name="filter" [size]="16" class="text-cypress"></app-icon>
        </button>
      </div>

      <!-- Grid de outfits -->
      <div 
        *ngIf="outfitsFiltrados.length > 0; else emptyState"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <mat-card 
          *ngFor="let outfit of outfitsFiltrados" 
          class="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
        >
          <div class="aspect-[3/4] relative bg-vanilla/50">
            <img 
              [src]="outfit.imagen || '/assets/placeholder.svg'" 
              [alt]="outfit.nombre"
              class="object-cover w-full h-full"
            >
            <mat-chip class="absolute top-2 right-2 bg-cypress text-aloe text-xs">
              {{ outfit.ocasion }}
            </mat-chip>
            <div class="absolute top-2 left-2 flex gap-1">
              <button 
                mat-icon-button 
                class="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                (click)="toggleFavorito(outfit.id)"
              >
                <app-icon 
                  name="heart" 
                  [size]="16"
                  [class.text-red-500]="outfit.favorito"
                  [class.fill-current]="outfit.favorito"
                  [class.text-gray-500]="!outfit.favorito"
                ></app-icon>
              </button>
            </div>
          </div>
          <mat-card-content class="p-4">
            <h3 class="font-medium text-mahogany text-base font-serif">{{ outfit.nombre }}</h3>
            <div class="mt-2 space-y-1">
              <p *ngFor="let prendaId of outfit.prendas" class="text-xs text-gray-600">
                • {{ getNombrePrenda(prendaId) }}
              </p>
            </div>
            <div class="flex flex-wrap gap-1 mt-2">
              <mat-chip 
                *ngFor="let temp of outfit.temporada" 
                class="bg-aloe/30 text-cypress border-olive text-xs"
              >
                {{ temp }}
              </mat-chip>
            </div>
          </mat-card-content>
          <mat-card-actions class="flex justify-between p-4 pt-0">
            <div class="flex gap-1">
              <button 
                mat-button 
                class="text-cypress hover:text-moss text-xs h-7 px-2"
                (click)="editarOutfit(outfit)"
              >
                <app-icon name="edit" [size]="12" class="mr-1"></app-icon>
                Editar
              </button>
              <button 
                mat-button 
                class="text-cypress hover:text-moss text-xs h-7 px-2"
                (click)="eliminarOutfit(outfit.id)"
              >
                <app-icon name="trash2" [size]="12" class="mr-1"></app-icon>
                Eliminar
              </button>
            </div>
            <button 
              mat-button 
              class="text-cypress hover:text-moss text-xs h-7 px-2"
              (click)="compartirOutfit(outfit)"
            >
              <app-icon name="share2" [size]="12" class="mr-1"></app-icon>
              Compartir
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Estado vacío -->
      <ng-template #emptyState>
        <div class="flex flex-col items-center justify-center p-8 text-gray-600 bg-aloe/20 border border-cypress/20 rounded-lg">
          <p class="mb-4">No se encontraron outfits con los filtros seleccionados</p>
          <button 
            mat-stroked-button 
            class="border-cypress text-cypress"
            (click)="limpiarFiltros()"
          >
            Limpiar filtros
          </button>
        </div>
      </ng-template>
    </div>
  `,
})
export class OutfitsComponent implements OnInit, OnDestroy {
  outfits: Outfit[] = []
  prendas: Prenda[] = []
  searchTerm = ""

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    combineLatest([this.dataService.outfits$, this.dataService.prendas$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([outfits, prendas]) => {
        this.outfits = outfits
        this.prendas = prendas
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get outfitsFiltrados(): Outfit[] {
    if (!this.searchTerm) return this.outfits

    const termino = this.searchTerm.toLowerCase()
    return this.outfits.filter(
      (outfit) => outfit.nombre.toLowerCase().includes(termino) || outfit.ocasion.toLowerCase().includes(termino),
    )
  }

  toggleFavorito(id: string) {
    this.dataService.toggleFavoritoOutfit(id)
  }

  crearOutfit() {
    // TODO: Implementar diálogo de creación
    console.log("Crear outfit")
  }

  editarOutfit(outfit: Outfit) {
    // TODO: Implementar diálogo de edición
    console.log("Editar outfit:", outfit)
  }

  eliminarOutfit(id: string) {
    if (confirm("¿Estás seguro de que quieres eliminar este outfit?")) {
      this.dataService.eliminarOutfit(id)
    }
  }

  compartirOutfit(outfit: Outfit) {
    alert(`Compartiendo outfit: ${outfit.nombre}`)
  }

  limpiarFiltros() {
    this.searchTerm = ""
  }

  getNombrePrenda(id: string): string {
    const prenda = this.prendas.find((p) => p.id === id)
    return prenda ? prenda.nombre : "Prenda no encontrada"
  }
}
