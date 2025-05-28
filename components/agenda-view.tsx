"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/AppContext"
import { obtenerDiasMes, formatDate } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { EventoAgenda } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AgendaView() {
  const { eventosAgenda, outfits, agregarEvento, actualizarEvento, eliminarEvento } = useAppContext()

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Estados para formularios
  const [nuevoEvento, setNuevoEvento] = useState<Omit<EventoAgenda, "id">>({
    titulo: "",
    fecha: "",
    outfitId: "default", // Updated default value to be a non-empty string
    notas: "",
    recordatorio: false,
  })

  const [eventoEditando, setEventoEditando] = useState<EventoAgenda | null>(null)
  const [eventoEliminar, setEventoEliminar] = useState<string | null>(null)

  // Estados para diálogos
  const [dialogoNuevoEventoAbierto, setDialogoNuevoEventoAbierto] = useState(false)
  const [dialogoEditarEventoAbierto, setDialogoEditarEventoAbierto] = useState(false)
  const [dialogoEliminarEventoAbierto, setDialogoEliminarEventoAbierto] = useState(false)

  const days = obtenerDiasMes(currentYear, currentMonth)
  const monthName = new Date(currentYear, currentMonth).toLocaleString("es", { month: "long" })

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getEventForDate = (date: string | null) => {
    if (!date) return null
    return eventosAgenda.find((evento) => evento.fecha === date)
  }

  const getOutfitName = (outfitId?: string) => {
    if (!outfitId) return ""
    const outfit = outfits.find((o) => o.id === outfitId)
    return outfit ? outfit.nombre : "Outfit no encontrado"
  }

  // Manejar cambios en el formulario de nuevo evento
  const handleNuevoEventoChange = (field: string, value: any) => {
    setNuevoEvento((prev) => ({ ...prev, [field]: value }))
  }

  // Manejar cambios en el formulario de edición
  const handleEventoEditandoChange = (field: string, value: any) => {
    if (eventoEditando) {
      setEventoEditando((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  // Guardar nuevo evento
  const handleGuardarNuevoEvento = () => {
    agregarEvento(nuevoEvento)
    setNuevoEvento({
      titulo: "",
      fecha: "",
      outfitId: "default", // Updated default value to be a non-empty string
      notas: "",
      recordatorio: false,
    })
    setDialogoNuevoEventoAbierto(false)
  }

  // Guardar evento editado
  const handleGuardarEventoEditado = () => {
    if (eventoEditando) {
      actualizarEvento(eventoEditando.id, eventoEditando)
      setEventoEditando(null)
      setDialogoEditarEventoAbierto(false)
    }
  }

  // Eliminar evento
  const handleEliminarEvento = () => {
    if (eventoEliminar) {
      eliminarEvento(eventoEliminar)
      setEventoEliminar(null)
      setDialogoEliminarEventoAbierto(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con trigger del sidebar */}
      <div className="flex items-center justify-between mb-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-mahogany tracking-wide vintage-header">Agenda de Outfits</h1>
        <Dialog open={dialogoNuevoEventoAbierto} onOpenChange={setDialogoNuevoEventoAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm">
              <Plus className="mr-2 h-4 w-4" /> Añadir evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-mahogany">Añadir nuevo evento</DialogTitle>
              <DialogDescription>Programa un outfit para una fecha específica.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="titulo-evento" className="text-right">
                  Título
                </Label>
                <Input
                  id="titulo-evento"
                  value={nuevoEvento.titulo}
                  onChange={(e) => handleNuevoEventoChange("titulo", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha-evento" className="text-right">
                  Fecha
                </Label>
                <Input
                  id="fecha-evento"
                  type="date"
                  value={nuevoEvento.fecha}
                  onChange={(e) => handleNuevoEventoChange("fecha", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="outfit-evento" className="text-right">
                  Outfit
                </Label>
                <Select
                  value={nuevoEvento.outfitId || "default"} // Updated default value to be a non-empty string
                  onValueChange={(value) => handleNuevoEventoChange("outfitId", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un outfit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin outfit</SelectItem> // Updated value to be a non-empty string
                    {outfits.map((outfit) => (
                      <SelectItem key={outfit.id} value={outfit.id}>
                        {outfit.nombre} ({outfit.ocasion})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notas-evento" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="notas-evento"
                  value={nuevoEvento.notas || ""}
                  onChange={(e) => handleNuevoEventoChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recordatorio-evento" className="text-right">
                  Recordatorio
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="recordatorio-evento"
                    checked={nuevoEvento.recordatorio}
                    onCheckedChange={(checked) => handleNuevoEventoChange("recordatorio", !!checked)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoNuevoEventoAbierto(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-cypress hover:bg-moss text-vanilla"
                onClick={handleGuardarNuevoEvento}
                disabled={!nuevoEvento.titulo || !nuevoEvento.fecha}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-tobacco vintage-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" size="icon" onClick={prevMonth} className="border-cypress">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-medium capitalize visible-text">
              {monthName} {currentYear}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth} className="border-cypress">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <div key={day} className="text-center font-medium text-sm py-2 visible-text">
                {day}
              </div>
            ))}

            {days.map((day, i) => {
              const evento = getEventForDate(day.date)
              const isToday = day.date === new Date().toISOString().split("T")[0]

              return (
                <div
                  key={i}
                  className={`min-h-[80px] p-1 border border-cypress/30 relative ${
                    isToday ? "bg-cypress/10" : ""
                  } ${!day.day ? "bg-muted/30" : ""}`}
                >
                  {day.day && (
                    <>
                      <span className="text-sm font-medium visible-text">{day.day}</span>

                      {evento && (
                        <div className="mt-1 p-1 text-xs calendar-event rounded relative">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate">{evento.titulo}</p>
                              {evento.outfitId && <p className="text-xs truncate">{getOutfitName(evento.outfitId)}</p>}
                            </div>
                            <div className="flex gap-1 ml-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 text-vanilla hover:text-aloe"
                                      onClick={() => {
                                        setEventoEditando(evento)
                                        setDialogoEditarEventoAbierto(true)
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Editar evento</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 text-vanilla hover:text-red-300"
                                      onClick={() => {
                                        setEventoEliminar(evento.id)
                                        setDialogoEliminarEventoAbierto(true)
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Eliminar evento</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-mahogany mb-4 visible-text">Próximos eventos</h3>
        <div className="space-y-3">
          {eventosAgenda
            .filter((evento) => new Date(evento.fecha) >= new Date())
            .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
            .slice(0, 5)
            .map((evento) => (
              <Card key={evento.id} className="border-cypress vintage-card">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium visible-text">{evento.titulo}</p>
                    <p className="text-sm text-medium-contrast">{formatDate(evento.fecha)}</p>
                    {evento.outfitId && (
                      <p className="text-sm text-cypress font-medium">{getOutfitName(evento.outfitId)}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEventoEditando(evento)
                        setDialogoEditarEventoAbierto(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEventoEliminar(evento.id)
                        setDialogoEliminarEventoAbierto(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Diálogo para editar evento */}
      <Dialog open={dialogoEditarEventoAbierto} onOpenChange={setDialogoEditarEventoAbierto}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Editar evento</DialogTitle>
            <DialogDescription>Modifica los detalles del evento.</DialogDescription>
          </DialogHeader>
          {eventoEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-titulo-evento" className="text-right">
                  Título
                </Label>
                <Input
                  id="edit-titulo-evento"
                  value={eventoEditando.titulo}
                  onChange={(e) => handleEventoEditandoChange("titulo", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fecha-evento" className="text-right">
                  Fecha
                </Label>
                <Input
                  id="edit-fecha-evento"
                  type="date"
                  value={eventoEditando.fecha}
                  onChange={(e) => handleEventoEditandoChange("fecha", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-outfit-evento" className="text-right">
                  Outfit
                </Label>
                <Select
                  value={eventoEditando.outfitId || "default"} // Updated default value to be a non-empty string
                  onValueChange={(value) => handleEventoEditandoChange("outfitId", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un outfit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Sin outfit</SelectItem> // Updated value to be a non-empty string
                    {outfits.map((outfit) => (
                      <SelectItem key={outfit.id} value={outfit.id}>
                        {outfit.nombre} ({outfit.ocasion})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-notas-evento" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="edit-notas-evento"
                  value={eventoEditando.notas || ""}
                  onChange={(e) => handleEventoEditandoChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-recordatorio-evento" className="text-right">
                  Recordatorio
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="edit-recordatorio-evento"
                    checked={eventoEditando.recordatorio}
                    onCheckedChange={(checked) => handleEventoEditandoChange("recordatorio", !!checked)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEventoEditando(null)
                setDialogoEditarEventoAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-cypress hover:bg-moss text-vanilla"
              onClick={handleGuardarEventoEditado}
              disabled={!eventoEditando?.titulo || !eventoEditando?.fecha}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogoEliminarEventoAbierto} onOpenChange={setDialogoEliminarEventoAbierto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setEventoEliminar(null)
                setDialogoEliminarEventoAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarEvento}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
