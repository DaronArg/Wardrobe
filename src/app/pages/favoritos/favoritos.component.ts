import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatTabsModule } from "@angular/material/tabs"
import { MatChipsModule } from "@angular/material/chips"
import type { DataService } from "../../services/data.service"
import type { Prenda, Outfit } from "../../models/types"
import { Subject, takeUntil, combineLatest } from "rxjs"

@Component({
  selector: "app-favoritos",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatChipsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-mahogany">Mis Favoritos</h1>

      <mat-tab-group class="bg-muted">
        <mat-tab label="Prendas">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            <mat-card 
              *ngFor="let prenda of prendasFavoritas" 
              class="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <div class="aspect-square relative bg-vanilla/50">
                <img 
                  [src]="prenda.imagen || '/assets/placeholder.svg'" 
                  [alt]="prenda.nombre"
                  class="object-cover w-full h-full"
                >
              </div>
              <mat-card-content class="p-4">
                <h3 class="font-medium text-mahogany">{{ prenda.nombre }}</h3>
                <div class="flex gap-2 mt-2">
                  <mat-chip class="bg-sand text-mahogany border-tobacco text-xs">
                    {{ prenda.categoria }}
                  </mat-chip>
                  <mat-chip class="bg-aloe text-cypress border-olive text-xs">
                    {{ prenda.color }}
                  </mat-chip>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Outfits">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <mat-card 
              *ngFor="let outfit of outfitsFavoritos" 
              class="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <div class="aspect-[3/4] relative bg-vanilla/50">
                <img 
                  [src]="outfit.imagen || '/assets/placeholder.svg'" 
                  [alt]="outfit.nombre"
                  class="object-cover w-full h-full"
                >
                <mat-chip class="absolute top-2 right-2 bg-cypress text-white">
                  {{ outfit.ocasion }}
                </mat-chip>
              </div>
              <mat-card-content class="p-4">
                <h3 class="font-medium text-mahogany text-lg">{{ outfit.nombre }}</h3>
                <div class="mt-2 space-y-1">
                  <p *ngFor="let prendaId of outfit.prendas" class="text-sm text-gray-600">
                    • {{ getNombrePrenda(prendaId) }}
                  </p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class FavoritosComponent implements OnInit, OnDestroy {
  prendasFavoritas: Prenda[] = []
  outfitsFavoritos: Outfit[] = []
  prendas: Prenda[] = []

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    combineLatest([this.dataService.prendas$, this.dataService.outfits$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([prendas, outfits]) => {
        this.prendas = prendas
        this.prendasFavoritas = prendas.filter((p) => p.favorito)
        this.outfitsFavoritos = outfits.filter((o) => o.favorito)
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  getNombrePrenda(id: string): string {
    const prenda = this.prendas.find((p) => p.id === id)
    return prenda ? prenda.nombre : "Prenda no encontrada"
  }
}
