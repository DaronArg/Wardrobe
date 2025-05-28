"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Plus, Edit, Trash2, Filter, X } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/AppContext"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Outfit } from "@/lib/types"
import { ocasionesDisponibles, temporadasDisponibles } from "@/lib/data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function OutfitsView() {
  const { outfits, prendas, agregarOutfit, actualizarOutfit, eliminarOutfit, toggleFavoritoOutfit } = useAppContext()

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({
    ocasiones: [] as string[],
    temporadas: [] as string[],
    favoritos: false,
  })
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false)

  // Estados para formularios
  const [nuevoOutfit, setNuevoOutfit] = useState<Omit<Outfit, "id" | "fechaCreacion">>({
    nombre: "",
    ocasion: "",
    temporada: [],
    prendas: [],
    imagen: "/stylish-streetwear-outfit.png",
    favorito: false,
    notas: "",
  })

  const [outfitEditando, setOutfitEditando] = useState<Outfit | null>(null)
  const [outfitEliminar, setOutfitEliminar] = useState<string | null>(null)

  // Estados para diálogos
  const [dialogoNuevoOutfitAbierto, setDialogoNuevoOutfitAbierto] = useState(false)
  const [dialogoEditarOutfitAbierto, setDialogoEditarOutfitAbierto] = useState(false)
  const [dialogoEliminarOutfitAbierto, setDialogoEliminarOutfitAbierto] = useState(false)

  // Filtrar outfits
  const outfitsFiltrados = outfits.filter((outfit) => {
    // Filtro por búsqueda
    if (
      searchTerm &&
      !outfit.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !outfit.ocasion.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filtros avanzados
    if (filtrosAvanzados.ocasiones.length > 0 && !filtrosAvanzados.ocasiones.includes(outfit.ocasion)) {
      return false
    }

    if (
      filtrosAvanzados.temporadas.length > 0 &&
      !outfit.temporada.some((t) => filtrosAvanzados.temporadas.includes(t))
    ) {
      return false
    }

    if (filtrosAvanzados.favoritos && !outfit.favorito) {
      return false
    }

    return true
  })

  // Manejar cambios en el formulario de nuevo outfit
  const handleNuevoOutfitChange = (field: string, value: any) => {
    setNuevoOutfit((prev) => ({ ...prev, [field]: value }))
  }

  // Manejar cambios en el formulario de edición
  const handleOutfitEditandoChange = (field: string, value: any) => {
    if (outfitEditando) {
      setOutfitEditando((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  // Guardar nuevo outfit
  const handleGuardarNuevoOutfit = () => {
    agregarOutfit(nuevoOutfit)
    setNuevoOutfit({
      nombre: "",
      ocasion: "",
      temporada: [],
      prendas: [],
      imagen: "/stylish-streetwear-outfit.png",
      favorito: false,
      notas: "",
    })
    setDialogoNuevoOutfitAbierto(false)
  }

  // Guardar outfit editado
  const handleGuardarOutfitEditado = () => {
    if (outfitEditando) {
      actualizarOutfit(outfitEditando.id, outfitEditando)
      setOutfitEditando(null)
      setDialogoEditarOutfitAbierto(false)
    }
  }

  // Eliminar outfit
  const handleEliminarOutfit = () => {
    if (outfitEliminar) {
      eliminarOutfit(outfitEliminar)
      setOutfitEliminar(null)
      setDialogoEliminarOutfitAbierto(false)
    }
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm("")
    setFiltrosAvanzados({
      ocasiones: [],
      temporadas: [],
      favoritos: false,
    })
  }

  // Obtener nombre de prenda por ID
  const getNombrePrenda = (id: string) => {
    const prenda = prendas.find((p) => p.id === id)
    return prenda ? prenda.nombre : "Prenda no encontrada"
  }

  // Compartir outfit (simulado)
  const compartirOutfit = (outfit: Outfit) => {
    alert(`Compartiendo outfit: ${outfit.nombre}`)
  }

  return (
    <div className="space-y-6">
      {/* Header con trigger del sidebar */}
      <div className="flex items-center justify-between mb-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-mahogany font-serif tracking-wide vintage-header">Mis Outfits</h1>
        <Dialog open={dialogoNuevoOutfitAbierto} onOpenChange={setDialogoNuevoOutfitAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm">
              <Plus className="mr-2 h-4 w-4" /> Crear outfit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-mahogany">Crear nuevo outfit</DialogTitle>
              <DialogDescription>Combina prendas de tu armario para crear un nuevo outfit.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre-outfit" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre-outfit"
                  value={nuevoOutfit.nombre}
                  onChange={(e) => handleNuevoOutfitChange("nombre", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ocasion-outfit" className="text-right">
                  Ocasión
                </Label>
                <Select
                  value={nuevoOutfit.ocasion}
                  onValueChange={(value) => handleNuevoOutfitChange("ocasion", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una ocasión" />
                  </SelectTrigger>
                  <SelectContent>
                    {ocasionesDisponibles.map((ocasion) => (
                      <SelectItem key={ocasion} value={ocasion}>
                        {ocasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="temporada-outfit" className="text-right pt-2">
                  Temporada
                </Label>
                <div className="col-span-3 space-y-2">
                  {temporadasDisponibles.map((temporada) => (
                    <div key={temporada} className="flex items-center space-x-2">
                      <Checkbox
                        id={`temporada-outfit-${temporada}`}
                        checked={nuevoOutfit.temporada.includes(temporada)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleNuevoOutfitChange("temporada", [...nuevoOutfit.temporada, temporada])
                          } else {
                            handleNuevoOutfitChange(
                              "temporada",
                              nuevoOutfit.temporada.filter((t) => t !== temporada),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`temporada-outfit-${temporada}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {temporada}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="prendas-outfit" className="text-right pt-2">
                  Prendas
                </Label>
                <div className="col-span-3">
                  <ScrollArea className="h-40 rounded-md border p-2">
                    <div className="space-y-1">
                      {prendas.map((prenda) => (
                        <div key={prenda.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`prenda-outfit-${prenda.id}`}
                            checked={nuevoOutfit.prendas.includes(prenda.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleNuevoOutfitChange("prendas", [...nuevoOutfit.prendas, prenda.id])
                              } else {
                                handleNuevoOutfitChange(
                                  "prendas",
                                  nuevoOutfit.prendas.filter((p) => p !== prenda.id),
                                )
                              }
                            }}
                          />
                          <label
                            htmlFor={`prenda-outfit-${prenda.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {prenda.nombre} ({prenda.categoria}, {prenda.color})
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notas-outfit" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="notas-outfit"
                  value={nuevoOutfit.notas || ""}
                  onChange={(e) => handleNuevoOutfitChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="favorito-outfit" className="text-right">
                  Favorito
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="favorito-outfit"
                    checked={nuevoOutfit.favorito}
                    onCheckedChange={(checked) => handleNuevoOutfitChange("favorito", !!checked)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoNuevoOutfitAbierto(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-cypress hover:bg-moss text-vanilla"
                onClick={handleGuardarNuevoOutfit}
                disabled={!nuevoOutfit.nombre || !nuevoOutfit.ocasion || nuevoOutfit.prendas.length === 0}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Buscar outfits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-cypress vintage-border bg-aloe/30 text-sm pl-4 pr-9"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Popover open={mostrarFiltrosAvanzados} onOpenChange={setMostrarFiltrosAvanzados}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="border-cypress vintage-border bg-aloe/30">
              <Filter className="h-4 w-4 text-cypress" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Filtros avanzados</h4>
              <div className="space-y-2">
                <Label className="text-xs">Ocasiones</Label>
                <div className="flex flex-wrap gap-2">
                  {ocasionesDisponibles.map((ocasion) => (
                    <Badge
                      key={ocasion}
                      variant={filtrosAvanzados.ocasiones.includes(ocasion) ? "default" : "outline"}
                      className={
                        filtrosAvanzados.ocasiones.includes(ocasion)
                          ? "bg-cypress text-vanilla cursor-pointer"
                          : "bg-transparent border-cypress text-cypress cursor-pointer"
                      }
                      onClick={() => {
                        if (filtrosAvanzados.ocasiones.includes(ocasion)) {
                          setFiltrosAvanzados({
                            ...filtrosAvanzados,
                            ocasiones: filtrosAvanzados.ocasiones.filter((o) => o !== ocasion),
                          })
                        } else {
                          setFiltrosAvanzados({
                            ...filtrosAvanzados,
                            ocasiones: [...filtrosAvanzados.ocasiones, ocasion],
                          })
                        }
                      }}
                    >
                      {ocasion}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Temporadas</Label>
                <div className="flex flex-wrap gap-2">
                  {temporadasDisponibles.map((temporada) => (
                    <Badge
                      key={temporada}
                      variant={filtrosAvanzados.temporadas.includes(temporada) ? "default" : "outline"}
                      className={
                        filtrosAvanzados.temporadas.includes(temporada)
                          ? "bg-cypress text-vanilla cursor-pointer"
                          : "bg-transparent border-cypress text-cypress cursor-pointer"
                      }
                      onClick={() => {
                        if (filtrosAvanzados.temporadas.includes(temporada)) {
                          setFiltrosAvanzados({
                            ...filtrosAvanzados,
                            temporadas: filtrosAvanzados.temporadas.filter((t) => t !== temporada),
                          })
                        } else {
                          setFiltrosAvanzados({
                            ...filtrosAvanzados,
                            temporadas: [...filtrosAvanzados.temporadas, temporada],
                          })
                        }
                      }}
                    >
                      {temporada}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-favoritos-outfit"
                  checked={filtrosAvanzados.favoritos}
                  onCheckedChange={(checked) => {
                    setFiltrosAvanzados({
                      ...filtrosAvanzados,
                      favoritos: !!checked,
                    })
                  }}
                />
                <label
                  htmlFor="filter-favoritos-outfit"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Solo favoritos
                </label>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                  Limpiar filtros
                </Button>
                <Button
                  size="sm"
                  className="bg-cypress hover:bg-moss text-vanilla"
                  onClick={() => setMostrarFiltrosAvanzados(false)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {outfitsFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-aloe/20 border border-cypress/20 rounded-lg">
          <p className="mb-4">No se encontraron outfits con los filtros seleccionados</p>
          <Button variant="outline" onClick={limpiarFiltros} className="border-cypress text-cypress">
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfitsFiltrados.map((outfit) => (
            <Card
              key={outfit.id}
              className="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
            >
              <div className="aspect-[3/4] relative bg-vanilla/50">
                <img
                  src={outfit.imagen || "/placeholder.svg"}
                  alt={outfit.nombre}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 right-2 bg-cypress text-aloe text-xs">{outfit.ocasion}</Badge>
                <div className="absolute top-2 left-2 flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                          onClick={() => toggleFavoritoOutfit(outfit.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${outfit.favorito ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{outfit.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-mahogany text-base font-serif">{outfit.nombre}</h3>
                <div className="mt-2 space-y-1">
                  {outfit.prendas.map((prendaId, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {getNombrePrenda(prendaId)}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {outfit.temporada.map((temp) => (
                    <Badge key={temp} variant="outline" className="bg-aloe/30 text-cypress border-olive text-xs">
                      {temp}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-4 pt-0">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cypress hover:text-moss text-xs h-7 px-2"
                    onClick={() => {
                      setOutfitEditando(outfit)
                      setDialogoEditarOutfitAbierto(true)
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cypress hover:text-moss text-xs h-7 px-2"
                    onClick={() => {
                      setOutfitEliminar(outfit.id)
                      setDialogoEliminarOutfitAbierto(true)
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cypress hover:text-moss text-xs h-7 px-2"
                  onClick={() => compartirOutfit(outfit)}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Compartir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo para editar outfit */}
      <Dialog open={dialogoEditarOutfitAbierto} onOpenChange={setDialogoEditarOutfitAbierto}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Editar outfit</DialogTitle>
            <DialogDescription>Modifica los detalles del outfit.</DialogDescription>
          </DialogHeader>
          {outfitEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre-outfit" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre-outfit"
                  value={outfitEditando.nombre}
                  onChange={(e) => handleOutfitEditandoChange("nombre", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ocasion-outfit" className="text-right">
                  Ocasión
                </Label>
                <Select
                  value={outfitEditando.ocasion}
                  onValueChange={(value) => handleOutfitEditandoChange("ocasion", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una ocasión" />
                  </SelectTrigger>
                  <SelectContent>
                    {ocasionesDisponibles.map((ocasion) => (
                      <SelectItem key={ocasion} value={ocasion}>
                        {ocasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-temporada-outfit" className="text-right pt-2">
                  Temporada
                </Label>
                <div className="col-span-3 space-y-2">
                  {temporadasDisponibles.map((temporada) => (
                    <div key={temporada} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-temporada-outfit-${temporada}`}
                        checked={outfitEditando.temporada.includes(temporada)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleOutfitEditandoChange("temporada", [...outfitEditando.temporada, temporada])
                          } else {
                            handleOutfitEditandoChange(
                              "temporada",
                              outfitEditando.temporada.filter((t) => t !== temporada),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`edit-temporada-outfit-${temporada}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {temporada}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-prendas-outfit" className="text-right pt-2">
                  Prendas
                </Label>
                <div className="col-span-3">
                  <ScrollArea className="h-40 rounded-md border p-2">
                    <div className="space-y-1">
                      {prendas.map((prenda) => (
                        <div key={prenda.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-prenda-outfit-${prenda.id}`}
                            checked={outfitEditando.prendas.includes(prenda.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleOutfitEditandoChange("prendas", [...outfitEditando.prendas, prenda.id])
                              } else {
                                handleOutfitEditandoChange(
                                  "prendas",
                                  outfitEditando.prendas.filter((p) => p !== prenda.id),
                                )
                              }
                            }}
                          />
                          <label
                            htmlFor={`edit-prenda-outfit-${prenda.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {prenda.nombre} ({prenda.categoria}, {prenda.color})
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-notas-outfit" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="edit-notas-outfit"
                  value={outfitEditando.notas || ""}
                  onChange={(e) => handleOutfitEditandoChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-favorito-outfit" className="text-right">
                  Favorito
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="edit-favorito-outfit"
                    checked={outfitEditando.favorito}
                    onCheckedChange={(checked) => handleOutfitEditandoChange("favorito", !!checked)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOutfitEditando(null)
                setDialogoEditarOutfitAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-cypress hover:bg-moss text-vanilla"
              onClick={handleGuardarOutfitEditado}
              disabled={!outfitEditando?.nombre || !outfitEditando?.ocasion || outfitEditando?.prendas.length === 0}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogoEliminarOutfitAbierto} onOpenChange={setDialogoEliminarOutfitAbierto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este outfit? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setOutfitEliminar(null)
                setDialogoEliminarOutfitAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarOutfit}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
