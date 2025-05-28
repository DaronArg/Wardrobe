"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Bell, User, Shield, Palette } from "lucide-react"

export function ConfiguracionView() {
  const [notificaciones, setNotificaciones] = useState({
    nuevasRecomendaciones: true,
    recordatoriosOutfit: true,
    actualizacionesApp: false,
  })

  const [privacidad, setPrivacidad] = useState({
    perfilPublico: false,
    compartirEstadisticas: true,
    permitirSugerencias: true,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-marron-chocolate">Configuración</h1>

      <Tabs defaultValue="cuenta" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta" className="mt-4">
          <Card className="border-marron-claro">
            <CardHeader className="bg-gradient-to-r from-marron-medio/10 to-crema/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Información de cuenta
              </CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" defaultValue="Ana García" className="border-marron-claro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="ana.garcia@ejemplo.com"
                    className="border-marron-claro"
                  />
                </div>
              </div>

              <Separator className="my-4 bg-marron-claro/30" />

              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" className="border-marron-claro" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" className="border-marron-claro" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input id="confirm-password" type="password" className="border-marron-claro" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-6 pt-0">
              <Button variant="outline" className="border-marron-claro">
                Cancelar
              </Button>
              <Button className="bg-marron-medio hover:bg-marron-chocolate">Guardar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="mt-4">
          <Card className="border-marron-claro">
            <CardHeader className="bg-gradient-to-r from-marron-medio/10 to-crema/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Preferencias de notificaciones
              </CardTitle>
              <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Nuevas recomendaciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones cuando tengamos nuevas recomendaciones de outfits
                    </p>
                  </div>
                  <Switch
                    checked={notificaciones.nuevasRecomendaciones}
                    onCheckedChange={(checked) =>
                      setNotificaciones({ ...notificaciones, nuevasRecomendaciones: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de outfit</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe recordatorios sobre los outfits programados en tu agenda
                    </p>
                  </div>
                  <Switch
                    checked={notificaciones.recordatoriosOutfit}
                    onCheckedChange={(checked) =>
                      setNotificaciones({ ...notificaciones, recordatoriosOutfit: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de la aplicación</Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones sobre nuevas funciones y mejoras
                    </p>
                  </div>
                  <Switch
                    checked={notificaciones.actualizacionesApp}
                    onCheckedChange={(checked) => setNotificaciones({ ...notificaciones, actualizacionesApp: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 pt-0">
              <Button className="bg-marron-medio hover:bg-marron-chocolate">Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacidad" className="mt-4">
          <Card className="border-marron-claro">
            <CardHeader className="bg-gradient-to-r from-marron-medio/10 to-crema/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Privacidad y seguridad
              </CardTitle>
              <CardDescription>Gestiona tus preferencias de privacidad</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Perfil público</Label>
                    <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil y outfits</p>
                  </div>
                  <Switch
                    checked={privacidad.perfilPublico}
                    onCheckedChange={(checked) => setPrivacidad({ ...privacidad, perfilPublico: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compartir estadísticas</Label>
                    <p className="text-sm text-muted-foreground">
                      Compartir estadísticas anónimas para mejorar recomendaciones
                    </p>
                  </div>
                  <Switch
                    checked={privacidad.compartirEstadisticas}
                    onCheckedChange={(checked) => setPrivacidad({ ...privacidad, compartirEstadisticas: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir sugerencias personalizadas</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que la IA analice tu armario para sugerencias
                    </p>
                  </div>
                  <Switch
                    checked={privacidad.permitirSugerencias}
                    onCheckedChange={(checked) => setPrivacidad({ ...privacidad, permitirSugerencias: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 pt-0">
              <Button className="bg-marron-medio hover:bg-marron-chocolate">Guardar preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="apariencia" className="mt-4">
          <Card className="border-marron-claro">
            <CardHeader className="bg-gradient-to-r from-marron-medio/10 to-crema/30 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" /> Apariencia
              </CardTitle>
              <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Tema</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-video bg-beige-claro rounded-md border-2 border-marron-medio cursor-pointer"></div>
                      <span className="text-sm">Claro</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-video bg-marron-chocolate rounded-md border border-marron-claro cursor-pointer"></div>
                      <span className="text-sm">Oscuro</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full aspect-video bg-gradient-to-r from-beige-claro to-marron-claro rounded-md border border-marron-claro cursor-pointer"></div>
                      <span className="text-sm">Sistema</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base">Tamaño de fuente</Label>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <Button variant="outline" className="border-marron-claro">
                      Pequeño
                    </Button>
                    <Button variant="outline" className="border-marron-medio border-2">
                      Mediano
                    </Button>
                    <Button variant="outline" className="border-marron-claro">
                      Grande
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end p-6 pt-0">
              <Button className="bg-marron-medio hover:bg-marron-chocolate">Aplicar cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
