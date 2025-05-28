import { Component, Input, type OnInit, type ElementRef, ViewChild } from "@angular/core"
import {
  MessageCircle,
  Shirt,
  Palette,
  Heart,
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
  ChevronLeft,
  Menu,
  X,
  Send,
  Bot,
  Sparkles,
  FolderOpen,
  Share2,
  Grid,
  List,
  Bell,
  Shield,
} from "lucide"

@Component({
  selector: "app-icon",
  standalone: true,
  template: `<span #iconContainer class="inline-flex items-center justify-center"></span>`,
})
export class IconComponent implements OnInit {
  @Input() name!: string
  @Input() size = 24
  @ViewChild("iconContainer", { static: true }) iconContainer!: ElementRef

  private icons = {
    messageCircle: MessageCircle,
    shirt: Shirt,
    palette: Palette,
    heart: Heart,
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
    chevronLeft: ChevronLeft,
    menu: Menu,
    x: X,
    send: Send,
    bot: Bot,
    sparkles: Sparkles,
    folderOpen: FolderOpen,
    share2: Share2,
    grid: Grid,
    list: List,
    bell: Bell,
    shield: Shield,
  }

  ngOnInit() {
    this.loadIcon()
  }

  private loadIcon() {
    if (this.name && this.iconContainer) {
      const IconComponent = this.icons[this.name as keyof typeof this.icons]
      if (IconComponent) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("width", this.size.toString())
        svg.setAttribute("height", this.size.toString())
        svg.setAttribute("viewBox", "0 0 24 24")
        svg.setAttribute("fill", "none")
        svg.setAttribute("stroke", "currentColor")
        svg.setAttribute("stroke-width", "2")
        svg.setAttribute("stroke-linecap", "round")
        svg.setAttribute("stroke-linejoin", "round")

        // Crear el contenido del icono
        const iconData = IconComponent.toString()
        const parser = new DOMParser()
        const doc = parser.parseFromString(`<svg>${iconData}</svg>`, "image/svg+xml")
        const paths = doc.querySelectorAll("path, circle, line, rect, polygon")

        paths.forEach((path) => {
          svg.appendChild(path.cloneNode(true))
        })

        this.iconContainer.nativeElement.appendChild(svg)
      }
    }
  }
}
