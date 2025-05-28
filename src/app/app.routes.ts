import type { Routes } from "@angular/router"

export const routes: Routes = [
  { path: "", loadComponent: () => import("./pages/chat/chat.component").then((m) => m.ChatComponent) },
  { path: "armario", loadComponent: () => import("./pages/armario/armario.component").then((m) => m.ArmarioComponent) },
  { path: "outfits", loadComponent: () => import("./pages/outfits/outfits.component").then((m) => m.OutfitsComponent) },
  {
    path: "favoritos",
    loadComponent: () => import("./pages/favoritos/favoritos.component").then((m) => m.FavoritosComponent),
  },
  { path: "looks", loadComponent: () => import("./pages/looks/looks.component").then((m) => m.LooksComponent) },
  { path: "agenda", loadComponent: () => import("./pages/agenda/agenda.component").then((m) => m.AgendaComponent) },
  { path: "estilo", loadComponent: () => import("./pages/estilo/estilo.component").then((m) => m.EstiloComponent) },
  {
    path: "configuracion",
    loadComponent: () => import("./pages/configuracion/configuracion.component").then((m) => m.ConfiguracionComponent),
  },
  { path: "**", redirectTo: "" },
]
