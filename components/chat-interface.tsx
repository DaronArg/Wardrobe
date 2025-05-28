"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Plus, Trash2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/AppContext"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDate } from "@/lib/utils"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

export function ChatInterface() {
  const {
    conversaciones,
    conversacionActual,
    iniciarNuevaConversacion,
    seleccionarConversacion,
    enviarMensaje,
    eliminarConversacion,
  } = useAppContext()

  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversacionActual?.mensajes])

  const handleSend = () => {
    if (!input.trim()) return
    enviarMensaje(input)
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header con trigger del sidebar y botón de conversaciones */}
      <div className="flex items-center justify-between mb-4 p-2">
        <SidebarTrigger className="md:hidden" />
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="ml-auto border-cypress text-cypress">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversaciones
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4 max-h-[80vh]">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-mahogany">Conversaciones</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cypress text-cypress"
                  onClick={() => {
                    iniciarNuevaConversacion()
                    setDrawerOpen(false)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva
                </Button>
              </div>
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2 pr-4">
                  {conversaciones.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        conversacionActual?.id === conv.id
                          ? "bg-cypress/20 border-l-2 border-cypress"
                          : "hover:bg-cypress/10"
                      }`}
                      onClick={() => {
                        seleccionarConversacion(conv.id)
                        setDrawerOpen(false)
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate">{conv.titulo}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(conv.fechaActualizacion)}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                eliminarConversacion(conv.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar conversación</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <Card className="flex-1 mb-6 border-tobacco vintage-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cypress/20 to-olive/20 border-b border-sand/50 pb-4 text-center">
          <CardTitle className="text-mahogany font-serif text-xl tracking-wide flex items-center justify-center">
            <Sparkles className="h-5 w-5 mr-2 text-cypress" />
            ¿Cómo vas a vestir hoy?
          </CardTitle>
          <CardDescription className="text-tobacco font-medium">
            Pregúntame sobre outfits o cómo combinar tus prendas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 overflow-hidden h-[calc(100%-5rem)] vintage-paper">
          {!conversacionActual || conversacionActual.mensajes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-10">
              <div className="rounded-full bg-sand/60 p-6 border border-cypress/50 shadow-md">
                <Shirt className="h-12 w-12 text-cypress" />
              </div>
              <div className="space-y-3 max-w-md">
                <h3 className="text-xl font-medium text-mahogany">Tu asistente de moda personal</h3>
                <p className="text-mahogany/80 text-base">
                  Pregúntame sobre combinaciones de ropa, recomendaciones para ocasiones especiales o cómo sacarle más
                  partido a tu armario.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-6 w-full max-w-sm">
                <Button
                  variant="outline"
                  className="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                  onClick={() => setInput("¿Qué me pongo para una cena casual?")}
                >
                  ¿Qué me pongo para una cena casual?
                </Button>
                <Button
                  variant="outline"
                  className="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                  onClick={() => setInput("Combina mi camisa blanca")}
                >
                  Combina mi camisa blanca
                </Button>
                <Button
                  variant="outline"
                  className="border-cypress text-mahogany bg-aloe/40 hover:bg-cypress/20 px-4 py-3 text-sm h-auto whitespace-normal text-left"
                  onClick={() => setInput("¿Qué me recomiendas para el trabajo?")}
                >
                  ¿Qué me recomiendas para el trabajo?
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 py-4">
                {conversacionActual.mensajes.map((mensaje) => (
                  <div key={mensaje.id} className={`flex ${mensaje.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={mensaje.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}>
                      {mensaje.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Input
          placeholder="Escribe tu mensaje aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-cypress vintage-border py-5 px-4 text-sm bg-aloe/20"
        />
        <Button
          onClick={handleSend}
          className="bg-cypress hover:bg-moss text-vanilla px-6"
          size="lg"
          disabled={!input.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Enviar</span>
        </Button>
      </div>
    </div>
  )
}
