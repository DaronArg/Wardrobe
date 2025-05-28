import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, type Router } from "@angular/router"
import { IconComponent } from "../icon/icon.component"

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <aside class="fixed left-0 top-0 h-full w-64 bg-cypress/20 border-r border-cypress/40 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full">
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 border-b border-cypress/40">
          <div class="vintage-logo">
            <div class="logo-icon"></div>
            <span class="text-cypress font-serif font-bold text-xl">Armario Virtual</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 py-4">
          <ul class="space-y-2 px-2">
            <li *ngFor="let item of menuItems">
              <a 
                [routerLink]="item.path" 
                routerLinkActive="sidebar-item-active"
                class="flex items-center px-4 py-3 text-cypress hover:bg-cypress/10 rounded-md transition-colors duration-200"
              >
                <app-icon [name]="item.icon" [size]="20" class="mr-3"></app-icon>
                <span class="font-medium">{{ item.title }}</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Footer -->
        <div class="p-6 border-t border-cypress/40">
          <div class="flex items-center justify-between">
            <button class="p-2 rounded-full bg-olive/20 hover:bg-olive/30 transition-colors">
              <app-icon name="user" [size]="20" class="text-cypress"></app-icon>
            </button>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
    .sidebar-item-active {
      background-color: rgba(76, 88, 62, 0.25);
      border-left: 3px solid #4c583e;
    }

    .vintage-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background-color: #4c583e;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .logo-icon::before {
      content: "";
      width: 16px;
      height: 16px;
      background-color: #768064;
      border-radius: 2px;
      transform: rotate(45deg);
    }

    .logo-icon::after {
      content: "";
      position: absolute;
      width: 8px;
      height: 8px;
      background-color: #dadec2;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `,
  ],
})
export class SidebarComponent {
  menuItems = [
    { title: "Chat", icon: "messageCircle", path: "/" },
    { title: "Armario", icon: "folderOpen", path: "/armario" },
    { title: "Outfits", icon: "shirt", path: "/outfits" },
    { title: "Favoritos", icon: "heart", path: "/favoritos" },
    { title: "Looks por ocasión", icon: "shirt", path: "/looks" },
    { title: "Agenda de outfits", icon: "calendar", path: "/agenda" },
    { title: "Mi estilo", icon: "palette", path: "/estilo" },
    { title: "Configuración", icon: "settings", path: "/configuracion" },
  ]

  constructor(private router: Router) {}
}
