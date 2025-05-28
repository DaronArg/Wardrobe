"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <AppSidebar currentPath={pathname} />
      <SidebarInset className="bg-vanilla/70 vintage-texture">
        <main className="container mx-auto py-8 px-4 md:px-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
