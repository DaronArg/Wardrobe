import { Injectable } from "@angular/core"
import {
  MessageCircle,
  Shirt,
  Palette,
  Heart,
  Lightbulb,
  Calendar,
  User,
  Settings,
  Home,
  Plus,
  Search,
  Filter,
  Star,
  Trash2,
  Edit,
  Eye,
  ChevronRight,
  Menu,
  X,
  Send,
  Bot,
  UserIcon,
} from "lucide"

@Injectable({
  providedIn: "root",
})
export class IconService {
  private icons = {
    messageCircle: MessageCircle,
    shirt: Shirt,
    palette: Palette,
    heart: Heart,
    lightbulb: Lightbulb,
    calendar: Calendar,
    user: User,
    settings: Settings,
    home: Home,
    plus: Plus,
    search: Search,
    filter: Filter,
    star: Star,
    trash2: Trash2,
    edit: Edit,
    eye: Eye,
    chevronRight: ChevronRight,
    menu: Menu,
    x: X,
    send: Send,
    bot: Bot,
    userIcon: UserIcon,
  }

  getIcon(name: keyof typeof this.icons): string {
    const IconComponent = this.icons[name]
    if (IconComponent) {
      return IconComponent.toString()
    }
    return ""
  }

  createSvgElement(name: keyof typeof this.icons, size = 24): SVGElement {
    const IconComponent = this.icons[name]
    if (IconComponent) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("width", size.toString())
      svg.setAttribute("height", size.toString())
      svg.setAttribute("viewBox", "0 0 24 24")
      svg.setAttribute("fill", "none")
      svg.setAttribute("stroke", "currentColor")
      svg.setAttribute("stroke-width", "2")
      svg.setAttribute("stroke-linecap", "round")
      svg.setAttribute("stroke-linejoin", "round")
      svg.innerHTML = IconComponent.toString().replace(/<svg[^>]*>|<\/svg>/g, "")
      return svg
    }
    return document.createElementNS("http://www.w3.org/2000/svg", "svg")
  }
}
