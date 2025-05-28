import {
  Component,
  type OnInit,
  type OnDestroy,
  ViewChild,
  type ElementRef,
  type AfterViewChecked,
} from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { IconComponent } from "../../components/icon/icon.component"
import type { DataService } from "../../services/data.service"
import type { Conversacion } from "../../models/types"
import { Subject, takeUntil } from "rxjs"

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    IconComponent,
  ],
  template: `
    <div class="flex flex-col h-[calc(100vh-8rem)]">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4 p-2">
        <h1 class="text-xl font-bold text-mahogany tracking-wide vintage-header">Chat</h1>
        <button 
          mat-stroked-button 
          class="border-cypress text-cypress"
          (click)="toggleConversaciones()"
        >
          <app-icon name="messageCircle" [size]="16" class="mr-2"></app-icon>
          Conversaciones
        </button>
      </div>

      <!-- Lista de conversaciones (móvil) -->
      <div *ngIf="mostrarConversaciones" class="mb-4 p-4 bg-aloe/20 rounded-lg border border-cypress/20">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-mahogany">Conversaciones</h3>
          <button 
            mat-stroked-button 
            class="border-cypress text-cypress"
            (click)="iniciarNuevaConversacion()"
          >
            <app-icon name="plus" [size]="16" class="mr-2"></app-icon>
            Nueva
          </button>
        </div>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            *ngFor="let conv of conversaciones" 
            class="p-3 rounded-md cursor-pointer flex justify-between items-center transition-colors"
            [class.bg-cypress/20]="conversacionActual?.id === conv.id"
            [class.border-l-2]="conversacionActual?.id === conv.id"
            [class.border-cypress]="conversacionActual?.id === conv.id"
            [class.hover:bg-cypress/10]="conversacionActual?.id !== conv.id"
            (click)="seleccionarConversacion(conv.id)"
          >
            <div class="overflow-hidden">
              <p class="font-medium text-sm truncate">{{ conv.titulo }}</p>
              <p class="text-xs text-gray-600">{{ formatDate(conv.fechaActualizacion) }}</p>
            </div>
            <button 
              mat-icon-button 
              class="text-gray-500 hover:text-red-500"
              (click)="eliminarConversacion($event, conv.id)"
            >
              <app-icon name="trash2" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Chat -->
      <mat-card class="flex-1 mb-6 vintage-card overflow-hidden">
        <mat-card-header class="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50 pb-4 text-center">
          <mat-card-title class="text-mahogany font-serif text-xl tracking-wide flex items-center justify-center">
            <app-icon name="sparkles" [size]="20" class="mr-2 text-cypress"></app-icon>
            ¿Cómo vas a vestir hoy?
          </mat-card-title>
          <mat-card-subtitle class="text-tobacco font-medium">
            Pregúntame sobre outfits o cómo combinar tus prendas
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content class="p-6 overflow-hidden h-[calc(100%-5rem)]">
          <!-- Estado vacío -->
          <div *ngIf="!conversacionActual || conversacionActual.mensajes.length === 0" 
               class="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
            <div class="rounded-full bg-sand/60 p-6 border border-cypress/50 shadow-md">
              <app-icon name="shirt" [size]="48" class="text-cypress"></app-icon>
            </div>
            <div class="space-y-3 max-w-md">
              <h3 class="text-xl font-medium text-mahogany">Tu asistente de moda personal</h3>
              <p class="text-mahogany/80 text-base">
                Pregúntame sobre combinaciones de ropa, recomendaciones para ocasiones especiales o cómo sacarle más partido a tu armario.
              </p>
            </div>
            <div class="grid grid-cols-1 gap-3 mt-6 w-full max-w-sm">
              <button 
                mat-stroked-button 
                class="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                (click)="setInput('¿Qué me pongo para una cena casual?')"
              >
                ¿Qué me pongo para una cena casual?
              </button>
              <button 
                mat-stroked-button 
                class="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                (click)="setInput('Combina mi camisa blanca')"
              >
                Combina mi camisa blanca
              </button>
              <button 
                mat-stroked-button 
                class="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                (click)="setInput('¿Qué me recomiendas para el trabajo?')"
              >
                ¿Qué me recomiendas para el trabajo?
              </button>
            </div>
          </div>

          <!-- Mensajes -->
          <div *ngIf="conversacionActual && conversacionActual.mensajes.length > 0" 
               class="h-full overflow-y-auto pr-4" 
               #messagesContainer>
            <div class="space-y-6 py-4">
              <div *ngFor="let mensaje of conversacionActual.mensajes" 
                   class="flex"
                   [class.justify-end]="mensaje.role === 'user'"
                   [class.justify-start]="mensaje.role === 'assistant'">
                <div [class]="mensaje.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'">
                  {{ mensaje.content }}
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Input -->
      <div class="flex gap-3">
        <mat-form-field class="flex-1" appearance="outline">
          <input 
            matInput 
            placeholder="Escribe tu mensaje aquí..."
            [(ngModel)]="input"
            (keydown.enter)="handleSend()"
            class="border-cypress vintage-border py-5 px-4 text-sm bg-aloe/20"
          >
        </mat-form-field>
        <button 
          mat-raised-button 
          class="bg-cypress hover:bg-moss text-vanilla px-6"
          [disabled]="!input.trim()"
          (click)="handleSend()"
        >
          <app-icon name="send" [size]="20"></app-icon>
        </button>
      </div>
    </div>
  `,
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("messagesContainer") messagesContainer!: ElementRef

  input = ""
  conversaciones: Conversacion[] = []
  conversacionActual: Conversacion | null = null
  mostrarConversaciones = false

  private destroy$ = new Subject<void>()

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.conversaciones$.pipe(takeUntil(this.destroy$)).subscribe((conversaciones) => {
      this.conversaciones = conversaciones
    })

    this.dataService.conversacionActual$.pipe(takeUntil(this.destroy$)).subscribe((conversacion) => {
      this.conversacionActual = conversacion
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  handleSend() {
    if (!this.input.trim()) return
    this.dataService.enviarMensaje(this.input)
    this.input = ""
  }

  setInput(text: string) {
    this.input = text
  }

  iniciarNuevaConversacion() {
    this.dataService.iniciarNuevaConversacion()
    this.mostrarConversaciones = false
  }

  seleccionarConversacion(id: string) {
    this.dataService.seleccionarConversacion(id)
    this.mostrarConversaciones = false
  }

  eliminarConversacion(event: Event, id: string) {
    event.stopPropagation()
    this.dataService.eliminarConversacion(id)
  }

  toggleConversaciones() {
    this.mostrarConversaciones = !this.mostrarConversaciones
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight
      } catch (err) {}
    }
  }
}
