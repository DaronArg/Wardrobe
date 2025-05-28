"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { FolderIcon as Hanger, Shirt, Heart, Calendar, Palette, Settings, MessageSquare, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppSidebarProps {
  currentPath: string
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const menuItems = [
    {
      title: "Chat",
      icon: MessageSquare,
      path: "/",
    },
    {
      title: "Armario",
      icon: Hanger,
      path: "/armario",
    },
    {
      title: "Outfits",
      icon: Shirt,
      path: "/outfits",
    },
    {
      title: "Favoritos",
      icon: Heart,
      path: "/favoritos",
    },
    {
      title: "Looks por ocasión",
      icon: Shirt,
      path: "/looks",
    },
    {
      title: "Agenda de outfits",
      icon: Calendar,
      path: "/agenda",
    },
    {
      title: "Mi estilo",
      icon: Palette,
      path: "/estilo",
    },
    {
      title: "Configuración",
      icon: Settings,
      path: "/configuracion",
    },
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2 p-6 border-b border-sidebar-border bg-cypress/20">
        <div className="flex items-center justify-between">
          <div className="vintage-logo">
            <div className="logo-icon"></div>
            <span>Armario Virtual</span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4 bg-gradient-to-b from-cypress/5 to-moss/5">
        <SidebarMenu className="space-y-3">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path} className="px-2">
              <SidebarMenuButton
                asChild
                isActive={currentPath === item.path}
                tooltip={item.title}
                className={cn(
                  "py-3 px-4 transition-all duration-200 text-sm hover:bg-cypress/10",
                  currentPath === item.path && "sidebar-item-active",
                )}
              >
                <Link href={item.path} className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 text-cypress" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-sidebar-border bg-cypress/15">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-full bg-olive/20 hover:bg-olive/30">
            <User className="h-5 w-5 text-cypress" />
          </Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
