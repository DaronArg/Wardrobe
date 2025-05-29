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
import  { DataService } from "../../services/data.service"
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
  templateUrl: "./chat.component.html",
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
