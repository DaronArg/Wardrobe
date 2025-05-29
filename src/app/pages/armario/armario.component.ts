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
import { MatDialogModule,  MatDialog } from "@angular/material/dialog"
import { IconComponent } from "../../components/icon/icon.component"
import  { DataService } from "../../services/data.service"
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
  templateUrl: "./armario.component.html",
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
