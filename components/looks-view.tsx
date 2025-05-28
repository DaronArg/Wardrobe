import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos de ejemplo
const ocasiones = [
  {
    id: "casual",
    nombre: "Casual",
    outfits: [
      {
        id: 1,
        nombre: "Fin de semana",
        prendas: ["Jeans", "Camiseta gris", "Zapatillas blancas"],
        imagen: "/placeholder.svg?height=400&width=300&query=weekend casual outfit",
      },
      {
        id: 2,
        nombre: "Día de campo",
        prendas: ["Shorts", "Blusa floral", "Sombrero"],
        imagen: "/placeholder.svg?height=400&width=300&query=picnic outfit",
      },
    ],
  },
  {
    id: "formal",
    nombre: "Formal",
    outfits: [
      {
        id: 3,
        nombre: "Cena elegante",
        prendas: ["Vestido negro", "Tacones", "Bolso pequeño"],
        imagen: "/elegant-dinner-outfit.png",
      },
    ],
  },
  {
    id: "trabajo",
    nombre: "Trabajo",
    outfits: [
      {
        id: 4,
        nombre: "Casual de oficina",
        prendas: ["Camisa blanca", "Pantalón negro", "Zapatos marrones"],
        imagen: "/business-casual-outfit.png",
      },
    ],
  },
  {
    id: "deporte",
    nombre: "Deporte",
    outfits: [
      {
        id: 5,
        nombre: "Entrenamiento",
        prendas: ["Leggings", "Top deportivo", "Zapatillas running"],
        imagen: "/placeholder.svg?height=400&width=300&query=workout outfit",
      },
    ],
  },
]

export function LooksView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-marron-chocolate">Looks por Ocasión</h1>

      <Tabs defaultValue="casual" className="w-full">
        <TabsList className="bg-muted">
          {ocasiones.map((ocasion) => (
            <TabsTrigger key={ocasion.id} value={ocasion.id}>
              {ocasion.nombre}
            </TabsTrigger>
          ))}
        </TabsList>

        {ocasiones.map((ocasion) => (
          <TabsContent key={ocasion.id} value={ocasion.id} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ocasion.outfits.map((outfit) => (
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
                    <Badge className="absolute top-2 right-2 bg-marron-medio text-white">{ocasion.nombre}</Badge>
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
        ))}
      </Tabs>
    </div>
  )
}
