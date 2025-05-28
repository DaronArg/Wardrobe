import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatTabsModule } from "@angular/material/tabs"
import { MatChipsModule } from "@angular/material/chips"

@Component({
  selector: "app-looks",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, MatChipsModule],
  template: `
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-mahogany">Looks por Ocasión</h1>

      <mat-tab-group class="bg-muted">
        <mat-tab *ngFor="let ocasion of ocasiones" [label]="ocasion.nombre">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            <mat-card 
              *ngFor="let outfit of ocasion.outfits" 
              class="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <div class="aspect-[3/4] relative bg-vanilla/50">
                <img 
                  [src]="outfit.imagen || '/assets/placeholder.svg'" 
                  [alt]="outfit.nombre"
                  class="object-cover w-full h-full"
                >
                <mat-chip class="absolute top-2 right-2 bg-cypress text-white">
                  {{ ocasion.nombre }}
                </mat-chip>
              </div>
              <mat-card-content class="p-4">
                <h3 class="font-medium text-mahogany text-lg">{{ outfit.nombre }}</h3>
                <div class="mt-2 space-y-1">
                  <p *ngFor="let prenda of outfit.prendas" class="text-sm text-gray-600">
                    • {{ prenda }}
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
export class LooksComponent {
  ocasiones = [
    {
      id: "casual",
      nombre: "Casual",
      outfits: [
        {
          id: 1,
          nombre: "Fin de semana",
          prendas: ["Jeans", "Camiseta gris", "Zapatillas blancas"],
          imagen: "/assets/weekend-casual-outfit.png",
        },
        {
          id: 2,
          nombre: "Día de campo",
          prendas: ["Shorts", "Blusa floral", "Sombrero"],
          imagen: "/assets/picnic-outfit.png",
        },
      ],
    },
    {
      id: "formal",
      nombre: "Formal",
      outfits: [
        {
          id: 3,
          nombre: "Cena elegante",
          prendas: ["Vestido negro", "Tacones", "Bolso pequeño"],
          imagen: "/assets/elegant-dinner-outfit.png",
        },
      ],
    },
    {
      id: "trabajo",
      nombre: "Trabajo",
      outfits: [
        {
          id: 4,
          nombre: "Casual de oficina",
          prendas: ["Camisa blanca", "Pantalón negro", "Zapatos marrones"],
          imagen: "/assets/business-casual-outfit.png",
        },
      ],
    },
    {
      id: "deporte",
      nombre: "Deporte",
      outfits: [
        {
          id: 5,
          nombre: "Entrenamiento",
          prendas: ["Leggings", "Top deportivo", "Zapatillas running"],
          imagen: "/assets/workout-outfit.png",
        },
      ],
    },
  ]
}
