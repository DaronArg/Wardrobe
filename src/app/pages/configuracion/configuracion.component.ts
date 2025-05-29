import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatTabsModule } from "@angular/material/tabs"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatDividerModule } from "@angular/material/divider"
import { IconComponent } from "../../components/icon/icon.component"
import  { DataService } from "../../services/data.service"
import type { ConfiguracionUsuario } from "../../models/types"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-configuracion",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDividerModule,
    IconComponent,
  ],
  template: `
    <div class="space-y-6">
      <h1 class="text-xl font-bold text-mahogany tracking-wide vintage-header">Configuración</h1>

      <mat-tab-group class="w-full">
        <!-- Cuenta -->
        <mat-tab label="Cuenta">
          <mat-card class="border-tobacco vintage-card mt-4">
            <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
              <mat-card-title class="flex items-center gap-2">
                <app-icon name="user" [size]="20"></app-icon>
                Información de cuenta
              </mat-card-title>
              <mat-card-subtitle>Actualiza tu información personal</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-6 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Nombre</mat-label>
                  <input matInput [(ngModel)]="configuracion.nombre">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" [(ngModel)]="configuracion.email">
                </mat-form-field>
              </div>

              <mat-divider class="my-4"></mat-divider>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Contraseña actual</mat-label>
                <input matInput type="password">
              </mat-form-field>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <mat-form-field appearance="outline">
                  <mat-label>Nueva contraseña</mat-label>
                  <input matInput type="password">
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Confirmar contraseña</mat-label>
                  <input matInput type="password">
                </mat-form-field>
              </div>
            </mat-card-content>
            <mat-card-actions class="flex justify-end gap-2 p-6 pt-0">
              <button mat-stroked-button class="border-tobacco">Cancelar</button>
              <button mat-raised-button class="bg-cypress hover:bg-moss text-vanilla">
                Guardar cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- Notificaciones -->
        <mat-tab label="Notificaciones">
          <mat-card class="border-tobacco vintage-card mt-4">
            <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
              <mat-card-title class="flex items-center gap-2">
                <app-icon name="bell" [size]="20"></app-icon>
                Preferencias de notificaciones
              </mat-card-title>
              <mat-card-subtitle>Configura cómo quieres recibir notificaciones</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Nuevas recomendaciones</label>
                    <p class="text-sm text-gray-600">
                      Recibe notificaciones cuando tengamos nuevas recomendaciones de outfits
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.notificaciones.nuevasRecomendaciones"
                  ></mat-slide-toggle>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Recordatorios de outfit</label>
                    <p class="text-sm text-gray-600">
                      Recibe recordatorios sobre los outfits programados en tu agenda
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.notificaciones.recordatoriosOutfit"
                  ></mat-slide-toggle>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Actualizaciones de la aplicación</label>
                    <p class="text-sm text-gray-600">
                      Recibe notificaciones sobre nuevas funciones y mejoras
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.notificaciones.actualizacionesApp"
                  ></mat-slide-toggle>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions class="flex justify-end p-6 pt-0">
              <button mat-raised-button class="bg-cypress hover:bg-moss text-vanilla">
                Guardar preferencias
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- Privacidad -->
        <mat-tab label="Privacidad">
          <mat-card class="border-tobacco vintage-card mt-4">
            <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
              <mat-card-title class="flex items-center gap-2">
                <app-icon name="shield" [size]="20"></app-icon>
                Privacidad y seguridad
              </mat-card-title>
              <mat-card-subtitle>Gestiona tus preferencias de privacidad</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Perfil público</label>
                    <p class="text-sm text-gray-600">
                      Permite que otros usuarios vean tu perfil y outfits
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.privacidad.perfilPublico"
                  ></mat-slide-toggle>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Compartir estadísticas</label>
                    <p class="text-sm text-gray-600">
                      Compartir estadísticas anónimas para mejorar recomendaciones
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.privacidad.compartirEstadisticas"
                  ></mat-slide-toggle>
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <label class="font-medium">Permitir sugerencias personalizadas</label>
                    <p class="text-sm text-gray-600">
                      Permitir que la IA analice tu armario para sugerencias
                    </p>
                  </div>
                  <mat-slide-toggle 
                    [(ngModel)]="configuracion.privacidad.permitirSugerencias"
                  ></mat-slide-toggle>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions class="flex justify-end p-6 pt-0">
              <button mat-raised-button class="bg-cypress hover:bg-moss text-vanilla">
                Guardar preferencias
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>

        <!-- Apariencia -->
        <mat-tab label="Apariencia">
          <mat-card class="border-tobacco vintage-card mt-4">
            <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
              <mat-card-title class="flex items-center gap-2">
                <app-icon name="palette" [size]="20"></app-icon>
                Apariencia
              </mat-card-title>
              <mat-card-subtitle>Personaliza la apariencia de la aplicación</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-6">
              <div class="space-y-6">
                <div>
                  <label class="text-base font-medium">Tema</label>
                  <div class="grid grid-cols-3 gap-4 mt-3">
                    <div class="flex flex-col items-center gap-2">
                      <div 
                        class="w-full aspect-video bg-vanilla rounded-md border-2 cursor-pointer"
                        [class.border-cypress]="configuracion.tema === 'claro'"
                        [class.border-gray-300]="configuracion.tema !== 'claro'"
                        (click)="configuracion.tema = 'claro'"
                      ></div>
                      <span class="text-sm">Claro</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <div 
                        class="w-full aspect-video bg-mahogany rounded-md border cursor-pointer"
                        [class.border-cypress]="configuracion.tema === 'oscuro'"
                        [class.border-gray-300]="configuracion.tema !== 'oscuro'"
                        (click)="configuracion.tema = 'oscuro'"
                      ></div>
                      <span class="text-sm">Oscuro</span>
                    </div>
                    <div class="flex flex-col items-center gap-2">
                      <div 
                        class="w-full aspect-video bg-gradient-to-r from-vanilla to-tobacco rounded-md border cursor-pointer"
                        [class.border-cypress]="configuracion.tema === 'sistema'"
                        [class.border-gray-300]="configuracion.tema !== 'sistema'"
                        (click)="configuracion.tema = 'sistema'"
                      ></div>
                      <span class="text-sm">Sistema</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="text-base font-medium">Tamaño de fuente</label>
                  <div class="grid grid-cols-3 gap-4 mt-3">
                    <button 
                      mat-stroked-button 
                      [class.border-cypress]="configuracion.tamanoFuente === 'pequeno'"
                      [class.border-2]="configuracion.tamanoFuente === 'pequeno'"
                      (click)="configuracion.tamanoFuente = 'pequeno'"
                    >
                      Pequeño
                    </button>
                    <button 
                      mat-stroked-button 
                      [class.border-cypress]="configuracion.tamanoFuente === 'mediano'"
                      [class.border-2]="configuracion.tamanoFuente === 'mediano'"
                      (click)="configuracion.tamanoFuente = 'mediano'"
                    >
                      Mediano
                    </button>
                    <button 
                      mat-stroked-button 
                      [class.border-cypress]="configuracion.tamanoFuente === 'grande'"
                      [class.border-2]="configuracion.tamanoFuente === 'grande'"
                      (click)="configuracion.tamanoFuente = 'grande'"
                    >
                      Grande
                    </button>
                  </div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions class="flex justify-end p-6 pt-0">
              <button mat-raised-button class="bg-cypress hover:bg-moss text-vanilla">
                Aplicar cambios
              </button>
            </mat-card-actions>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
  configuracion: ConfiguracionUsuario = {
    nombre: "",
    email: "",
    notificaciones: {
      nuevasRecomendaciones: true,
      recordatoriosOutfit: true,
      actualizacionesApp: false,
    },
    privacidad: {
      perfilPublico: false,
      compartirEstadisticas: true,
      permitirSugerencias: true,
    },
    tema: "claro",
    tamanoFuente: "mediano",
  }

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.configuracionUsuario$.pipe(takeUntil(this.destroy$)).subscribe((config) => {
      this.configuracion = { ...config }
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
