import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { SidebarComponent } from "./components/sidebar/sidebar.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-vanilla/70 vintage-texture">
      <app-sidebar></app-sidebar>
      <main class="flex-1 p-4 md:p-6 ml-0 md:ml-64">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AppComponent {
  title = "mi-armario-virtual-angular"
}
