import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo
const prendasFavoritas = [
  { id: 1, nombre: "Camisa blanca", categoria: "Camisas", color: "Blanco", imagen: "/white-shirt.png" },
  {
    id: 2,
    nombre: "Jeans azules",
    categoria: "Pantalones",
    color: "Azul",
    imagen: "/placeholder.svg?height=200&width=200&query=blue jeans",
  },
  {
    id: 3,
    nombre: "Vestido negro",
    categoria: "Vestidos",
    color: "Negro",
    imagen: "/placeholder.svg?height=200&width=200&query=black dress",
  },
]

const outfitsFavoritos = [
  {
    id: 1,
    nombre: "Casual de oficina",
    ocasion: "Trabajo",
    prendas: ["Camisa blanca", "Pantalón negro", "Zapatos marrones"],
    imagen: "/business-casual-outfit.png",
  },
  {
    id: 2,
    nombre: "Cena elegante",
    ocasion: "Formal",
    prendas: ["Vestido negro", "Tacones", "Bolso pequeño"],
    imagen: "/elegant-dinner-outfit.png",
  },
]

export function FavoritosView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-marron-chocolate">Mis Favoritos</h1>

      <Tabs defaultValue="prendas" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="prendas">Prendas</TabsTrigger>
          <TabsTrigger value="outfits">Outfits</TabsTrigger>
        </TabsList>

        <TabsContent value="prendas" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {prendasFavoritas.map((prenda) => (
              <Card
                key={prenda.id}
                className="overflow-hidden border-marron-claro hover:border-marron-medio transition-colors"
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={prenda.imagen || "/placeholder.svg"}
                    alt={prenda.nombre}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-marron-chocolate">{prenda.nombre}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="bg-beige-claro text-marron-chocolate border-marron-claro">
                      {prenda.categoria}
                    </Badge>
                    <Badge variant="outline" className="bg-beige-claro text-marron-chocolate border-marron-claro">
                      {prenda.color}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outfits" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfitsFavoritos.map((outfit) => (
              <Card
                key={outfit.id}
                className="overflow-hidden border-marron-claro hover:border-marron-medio transition-colors"
              >
                <div className="aspect-[3/4] relative bg-muted">
                  <img
                    src={outfit.imagen || "/placeholder.svg"}
                    alt={outfit.nombre}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-marron-medio text-white">{outfit.ocasion}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-marron-chocolate text-lg">{outfit.nombre}</h3>
                  <div className="mt-2 space-y-1">
                    {outfit.prendas.map((prenda, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        • {prenda}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
