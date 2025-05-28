import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/AppContext"
import { obtenerEstadisticasArmario, obtenerCombinacionesPopulares } from "@/lib/utils"

export function EstiloView() {
  const { prendas, outfits, preferenciasEstilo } = useAppContext()

  // Calcular estadísticas dinámicas
  const estadisticas = obtenerEstadisticasArmario(prendas)
  const combinacionesPopulares = obtenerCombinacionesPopulares(outfits)

  return (
    <div className="space-y-6">
      {/* Header con trigger del sidebar */}
      <div className="flex items-center justify-between mb-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1"></div>
      </div>

      <h1 className="text-xl font-bold text-mahogany tracking-wide vintage-header">Mi Estilo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-tobacco vintage-card">
          <CardHeader className="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
            <CardTitle className="text-mahogany">Perfil de estilo</CardTitle>
            <CardDescription className="text-tobacco">Tu estilo personal definido</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg font-medium text-mahogany mb-4 visible-text">{preferenciasEstilo.estiloPersonal}</p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-mahogany mb-2 visible-text">Colores favoritos</h3>
                <div className="flex flex-wrap gap-2">
                  {preferenciasEstilo.coloresFavoritos.map((color) => (
                    <Badge key={color} className="visible-badge text-xs">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-mahogany mb-2 visible-text">Estampados preferidos</h3>
                <div className="flex flex-wrap gap-2">
                  {preferenciasEstilo.estampados.map((estampado) => (
                    <Badge key={estampado} className="visible-badge text-xs">
                      {estampado}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-mahogany mb-2 visible-text">Prendas favoritas</h3>
                <div className="flex flex-wrap gap-2">
                  {preferenciasEstilo.prendasFavoritas.map((prenda) => (
                    <Badge key={prenda} className="visible-badge text-xs">
                      {prenda}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-mahogany mb-2 visible-text">Ocasiones frecuentes</h3>
                <div className="flex flex-wrap gap-2">
                  {preferenciasEstilo.ocasionesFrecuentes.map((ocasion) => (
                    <Badge key={ocasion} className="badge-high-contrast text-xs">
                      {ocasion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-tobacco vintage-card">
          <CardHeader className="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
            <CardTitle className="text-mahogany">Estadísticas de armario</CardTitle>
            <CardDescription className="text-tobacco">Distribución de tus prendas</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {estadisticas.map((stat) => (
                <div key={stat.categoria} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="visible-text font-medium">{stat.categoria}</span>
                    <span className="text-medium-contrast font-medium">{stat.cantidad} prendas</span>
                  </div>
                  <Progress value={stat.porcentaje} className="h-2 bg-muted" indicatorClassName="bg-cypress" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-tobacco vintage-card">
        <CardHeader className="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50">
          <CardTitle className="text-mahogany">Combinaciones populares</CardTitle>
          <CardDescription className="text-tobacco">Tus combinaciones más utilizadas</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {combinacionesPopulares.map((combo, index) => (
              <div key={index} className="flex items-center p-3 border border-cypress/50 rounded-md vintage-card">
                <div className="flex-1">
                  <p className="font-medium visible-text">{combo.nombre}</p>
                </div>
                <Badge
                  className={
                    combo.frecuencia === "Alta"
                      ? "badge-high-contrast"
                      : combo.frecuencia === "Media"
                        ? "badge-medium-contrast"
                        : "badge-low-contrast"
                  }
                >
                  {combo.frecuencia}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
