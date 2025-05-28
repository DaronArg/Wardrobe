"use client"

import { useState } from "react"
import { Plus, Filter, Grid, List, Search, X, Heart, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/AppContext"
import { categoriasDisponibles, coloresDisponibles, temporadasDisponibles, ocasionesDisponibles } from "@/lib/data"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatPrice } from "@/lib/utils"
import type { Prenda } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ArmarioView() {
  const { prendas, agregarPrenda, actualizarPrenda, eliminarPrenda, toggleFavoritoPrenda } = useAppContext()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas")
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({
    colores: [] as string[],
    temporadas: [] as string[],
    ocasiones: [] as string[],
    favoritos: false,
  })
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false)

  // Estado para el formulario de nueva prenda
  const [nuevaPrenda, setNuevaPrenda] = useState<Omit<Prenda, "id">>({
    nombre: "",
    categoria: "",
    color: "",
    temporada: [],
    ocasiones: [],
    imagen: "/assorted-clothing-display.png",
    favorito: false,
  })

  // Estado para el formulario de edición
  const [prendaEditando, setPrendaEditando] = useState<Prenda | null>(null)

  // Estado para diálogos
  const [dialogoNuevaPrendaAbierto, setDialogoNuevaPrendaAbierto] = useState(false)
  const [dialogoEditarPrendaAbierto, setDialogoEditarPrendaAbierto] = useState(false)
  const [dialogoEliminarPrendaAbierto, setDialogoEliminarPrendaAbierto] = useState(false)
  const [prendaEliminar, setPrendaEliminar] = useState<string | null>(null)

  // Filtrar prendas
  const prendasFiltradas = prendas.filter((prenda) => {
    // Filtro por categoría
    if (categoriaSeleccionada !== "Todas" && prenda.categoria !== categoriaSeleccionada) {
      return false
    }

    // Filtro por búsqueda
    if (
      searchTerm &&
      !prenda.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prenda.categoria.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !prenda.color.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Filtros avanzados
    if (filtrosAvanzados.colores.length > 0 && !filtrosAvanzados.colores.includes(prenda.color)) {
      return false
    }

    if (
      filtrosAvanzados.temporadas.length > 0 &&
      !prenda.temporada.some((t) => filtrosAvanzados.temporadas.includes(t))
    ) {
      return false
    }

    if (
      filtrosAvanzados.ocasiones.length > 0 &&
      !prenda.ocasiones.some((o) => filtrosAvanzados.ocasiones.includes(o))
    ) {
      return false
    }

    if (filtrosAvanzados.favoritos && !prenda.favorito) {
      return false
    }

    return true
  })

  // Manejar cambios en el formulario de nueva prenda
  const handleNuevaPrendaChange = (field: string, value: any) => {
    setNuevaPrenda((prev) => ({ ...prev, [field]: value }))
  }

  // Manejar cambios en el formulario de edición
  const handlePrendaEditandoChange = (field: string, value: any) => {
    if (prendaEditando) {
      setPrendaEditando((prev) => (prev ? { ...prev, [field]: value } : null))
    }
  }

  // Guardar nueva prenda
  const handleGuardarNuevaPrenda = () => {
    agregarPrenda(nuevaPrenda)
    setNuevaPrenda({
      nombre: "",
      categoria: "",
      color: "",
      temporada: [],
      ocasiones: [],
      imagen: "/assorted-clothing-display.png",
      favorito: false,
    })
    setDialogoNuevaPrendaAbierto(false)
  }

  // Guardar prenda editada
  const handleGuardarPrendaEditada = () => {
    if (prendaEditando) {
      actualizarPrenda(prendaEditando.id, prendaEditando)
      setPrendaEditando(null)
      setDialogoEditarPrendaAbierto(false)
    }
  }

  // Eliminar prenda
  const handleEliminarPrenda = () => {
    if (prendaEliminar) {
      eliminarPrenda(prendaEliminar)
      setPrendaEliminar(null)
      setDialogoEliminarPrendaAbierto(false)
    }
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setSearchTerm("")
    setCategoriaSeleccionada("Todas")
    setFiltrosAvanzados({
      colores: [],
      temporadas: [],
      ocasiones: [],
      favoritos: false,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header con trigger del sidebar */}
      <div className="flex items-center justify-between mb-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold text-mahogany tracking-wide vintage-header">Mi Armario</h1>
        <Dialog open={dialogoNuevaPrendaAbierto} onOpenChange={setDialogoNuevaPrendaAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-cypress hover:bg-moss text-vanilla vintage-border text-sm">
              <Plus className="mr-2 h-4 w-4" /> Añadir prenda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-mahogany">Añadir nueva prenda</DialogTitle>
              <DialogDescription>Completa los detalles de la prenda que quieres añadir a tu armario.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={nuevaPrenda.nombre}
                  onChange={(e) => handleNuevaPrendaChange("nombre", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categoria" className="text-right">
                  Categoría
                </Label>
                <Select
                  value={nuevaPrenda.categoria}
                  onValueChange={(value) => handleNuevaPrendaChange("categoria", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasDisponibles
                      .filter((c) => c !== "Todas")
                      .map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Select value={nuevaPrenda.color} onValueChange={(value) => handleNuevaPrendaChange("color", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {coloresDisponibles.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="temporada" className="text-right pt-2">
                  Temporada
                </Label>
                <div className="col-span-3 space-y-2">
                  {temporadasDisponibles.map((temporada) => (
                    <div key={temporada} className="flex items-center space-x-2">
                      <Checkbox
                        id={`temporada-${temporada}`}
                        checked={nuevaPrenda.temporada.includes(temporada)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleNuevaPrendaChange("temporada", [...nuevaPrenda.temporada, temporada])
                          } else {
                            handleNuevaPrendaChange(
                              "temporada",
                              nuevaPrenda.temporada.filter((t) => t !== temporada),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`temporada-${temporada}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {temporada}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="ocasiones" className="text-right pt-2">
                  Ocasiones
                </Label>
                <div className="col-span-3 space-y-2">
                  {ocasionesDisponibles.map((ocasion) => (
                    <div key={ocasion} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ocasion-${ocasion}`}
                        checked={nuevaPrenda.ocasiones.includes(ocasion)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleNuevaPrendaChange("ocasiones", [...nuevaPrenda.ocasiones, ocasion])
                          } else {
                            handleNuevaPrendaChange(
                              "ocasiones",
                              nuevaPrenda.ocasiones.filter((o) => o !== ocasion),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`ocasion-${ocasion}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ocasion}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marca" className="text-right">
                  Marca
                </Label>
                <Input
                  id="marca"
                  value={nuevaPrenda.marca || ""}
                  onChange={(e) => handleNuevaPrendaChange("marca", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="precio" className="text-right">
                  Precio
                </Label>
                <Input
                  id="precio"
                  type="number"
                  value={nuevaPrenda.precio || ""}
                  onChange={(e) => handleNuevaPrendaChange("precio", Number.parseFloat(e.target.value) || "")}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fechaCompra" className="text-right">
                  Fecha de compra
                </Label>
                <Input
                  id="fechaCompra"
                  type="date"
                  value={nuevaPrenda.fechaCompra || ""}
                  onChange={(e) => handleNuevaPrendaChange("fechaCompra", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="notas" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="notas"
                  value={nuevaPrenda.notas || ""}
                  onChange={(e) => handleNuevaPrendaChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="favorito" className="text-right">
                  Favorito
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="favorito"
                    checked={nuevaPrenda.favorito}
                    onCheckedChange={(checked) => handleNuevaPrendaChange("favorito", !!checked)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogoNuevaPrendaAbierto(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-cypress hover:bg-moss text-vanilla"
                onClick={handleGuardarNuevaPrenda}
                disabled={!nuevaPrenda.nombre || !nuevaPrenda.categoria || !nuevaPrenda.color}
              >
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar prendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-cypress vintage-border bg-aloe/30 text-sm pl-9 pr-9"
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
        <div className="flex gap-2">
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
                  <Label className="text-xs">Colores</Label>
                  <ScrollArea className="h-24 rounded-md border p-2">
                    <div className="space-y-1">
                      {coloresDisponibles.map((color) => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-color-${color}`}
                            checked={filtrosAvanzados.colores.includes(color)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFiltrosAvanzados({
                                  ...filtrosAvanzados,
                                  colores: [...filtrosAvanzados.colores, color],
                                })
                              } else {
                                setFiltrosAvanzados({
                                  ...filtrosAvanzados,
                                  colores: filtrosAvanzados.colores.filter((c) => c !== color),
                                })
                              }
                            }}
                          />
                          <label
                            htmlFor={`filter-color-${color}`}
                            className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="filter-favoritos"
                    checked={filtrosAvanzados.favoritos}
                    onCheckedChange={(checked) => {
                      setFiltrosAvanzados({
                        ...filtrosAvanzados,
                        favoritos: !!checked,
                      })
                    }}
                  />
                  <label
                    htmlFor="filter-favoritos"
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
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-cypress text-vanilla" : "border-cypress vintage-border bg-aloe/30"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-cypress text-vanilla" : "border-cypress vintage-border bg-aloe/30"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue={categoriaSeleccionada} onValueChange={setCategoriaSeleccionada} className="w-full">
        <TabsList className="bg-sand/70 border border-cypress/40 text-sm">
          {categoriasDisponibles.map((categoria) => (
            <TabsTrigger
              key={categoria}
              value={categoria}
              className="data-[state=active]:bg-cypress data-[state=active]:text-vanilla"
            >
              {categoria}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={categoriaSeleccionada} className="mt-6">
          {prendasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground bg-aloe/20 border border-cypress/20 rounded-lg">
              <p className="mb-4">No se encontraron prendas con los filtros seleccionados</p>
              <Button variant="outline" onClick={limpiarFiltros} className="border-cypress text-cypress">
                Limpiar filtros
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {prendasFiltradas.map((prenda) => (
                <Card
                  key={prenda.id}
                  className="overflow-hidden border-tobacco hover:border-cypress transition-colors vintage-card"
                >
                  <div className="aspect-square relative bg-vanilla/50">
                    <img
                      src={prenda.imagen || "/placeholder.svg"}
                      alt={prenda.nombre}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                              onClick={() => toggleFavoritoPrenda(prenda.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${prenda.favorito ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{prenda.favorito ? "Quitar de favoritos" : "Añadir a favoritos"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                              onClick={() => {
                                setPrendaEditando(prenda)
                                setDialogoEditarPrendaAbierto(true)
                              }}
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar prenda</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 bg-white/80 hover:bg-white shadow-sm"
                              onClick={() => {
                                setPrendaEliminar(prenda.id)
                                setDialogoEliminarPrendaAbierto(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar prenda</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-mahogany font-serif text-sm">{prenda.nombre}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-sand text-mahogany border-tobacco text-xs">
                        {prenda.categoria}
                      </Badge>
                      <Badge variant="outline" className="bg-aloe text-cypress border-olive text-xs">
                        {prenda.color}
                      </Badge>
                    </div>
                    {prenda.precio && (
                      <p className="text-xs text-muted-foreground mt-2">{formatPrice(prenda.precio)}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {prendasFiltradas.map((prenda) => (
                <Card key={prenda.id} className="border-tobacco hover:border-cypress transition-colors vintage-card">
                  <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-vanilla/50 rounded-md overflow-hidden flex-shrink-0 border border-cypress/30">
                        <img
                          src={prenda.imagen || "/placeholder.svg"}
                          alt={prenda.nombre}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-mahogany font-serif text-sm">{prenda.nombre}</h3>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => toggleFavoritoPrenda(prenda.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${prenda.favorito ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setPrendaEditando(prenda)
                                setDialogoEditarPrendaAbierto(true)
                              }}
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setPrendaEliminar(prenda.id)
                                setDialogoEliminarPrendaAbierto(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="bg-sand text-mahogany border-tobacco text-xs">
                            {prenda.categoria}
                          </Badge>
                          <Badge variant="outline" className="bg-aloe text-cypress border-olive text-xs">
                            {prenda.color}
                          </Badge>
                          {prenda.precio && (
                            <Badge
                              variant="outline"
                              className="bg-transparent border-muted text-muted-foreground text-xs"
                            >
                              {formatPrice(prenda.precio)}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          <span>Temporadas: </span>
                          {prenda.temporada.join(", ")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Diálogo para editar prenda */}
      <Dialog open={dialogoEditarPrendaAbierto} onOpenChange={setDialogoEditarPrendaAbierto}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Editar prenda</DialogTitle>
            <DialogDescription>Modifica los detalles de la prenda.</DialogDescription>
          </DialogHeader>
          {prendaEditando && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={prendaEditando.nombre}
                  onChange={(e) => handlePrendaEditandoChange("nombre", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-categoria" className="text-right">
                  Categoría
                </Label>
                <Select
                  value={prendaEditando.categoria}
                  onValueChange={(value) => handlePrendaEditandoChange("categoria", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasDisponibles
                      .filter((c) => c !== "Todas")
                      .map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-color" className="text-right">
                  Color
                </Label>
                <Select
                  value={prendaEditando.color}
                  onValueChange={(value) => handlePrendaEditandoChange("color", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un color" />
                  </SelectTrigger>
                  <SelectContent>
                    {coloresDisponibles.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-temporada" className="text-right pt-2">
                  Temporada
                </Label>
                <div className="col-span-3 space-y-2">
                  {temporadasDisponibles.map((temporada) => (
                    <div key={temporada} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-temporada-${temporada}`}
                        checked={prendaEditando.temporada.includes(temporada)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handlePrendaEditandoChange("temporada", [...prendaEditando.temporada, temporada])
                          } else {
                            handlePrendaEditandoChange(
                              "temporada",
                              prendaEditando.temporada.filter((t) => t !== temporada),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`edit-temporada-${temporada}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {temporada}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-ocasiones" className="text-right pt-2">
                  Ocasiones
                </Label>
                <div className="col-span-3 space-y-2">
                  {ocasionesDisponibles.map((ocasion) => (
                    <div key={ocasion} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-ocasion-${ocasion}`}
                        checked={prendaEditando.ocasiones.includes(ocasion)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handlePrendaEditandoChange("ocasiones", [...prendaEditando.ocasiones, ocasion])
                          } else {
                            handlePrendaEditandoChange(
                              "ocasiones",
                              prendaEditando.ocasiones.filter((o) => o !== ocasion),
                            )
                          }
                        }}
                      />
                      <label
                        htmlFor={`edit-ocasion-${ocasion}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ocasion}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-marca" className="text-right">
                  Marca
                </Label>
                <Input
                  id="edit-marca"
                  value={prendaEditando.marca || ""}
                  onChange={(e) => handlePrendaEditandoChange("marca", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-precio" className="text-right">
                  Precio
                </Label>
                <Input
                  id="edit-precio"
                  type="number"
                  value={prendaEditando.precio || ""}
                  onChange={(e) => handlePrendaEditandoChange("precio", Number.parseFloat(e.target.value) || "")}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fechaCompra" className="text-right">
                  Fecha de compra
                </Label>
                <Input
                  id="edit-fechaCompra"
                  type="date"
                  value={prendaEditando.fechaCompra || ""}
                  onChange={(e) => handlePrendaEditandoChange("fechaCompra", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-notas" className="text-right pt-2">
                  Notas
                </Label>
                <Textarea
                  id="edit-notas"
                  value={prendaEditando.notas || ""}
                  onChange={(e) => handlePrendaEditandoChange("notas", e.target.value)}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-favorito" className="text-right">
                  Favorito
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="edit-favorito"
                    checked={prendaEditando.favorito}
                    onCheckedChange={(checked) => handlePrendaEditandoChange("favorito", !!checked)}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPrendaEditando(null)
                setDialogoEditarPrendaAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-cypress hover:bg-moss text-vanilla"
              onClick={handleGuardarPrendaEditada}
              disabled={!prendaEditando?.nombre || !prendaEditando?.categoria || !prendaEditando?.color}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogoEliminarPrendaAbierto} onOpenChange={setDialogoEliminarPrendaAbierto}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-mahogany">Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta prenda? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setPrendaEliminar(null)
                setDialogoEliminarPrendaAbierto(false)
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarPrenda}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
