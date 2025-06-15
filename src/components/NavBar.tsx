import {
  IconLayoutDashboard,
  IconUserPlus,
  IconCalendarCheck,
  IconLogout,
} from "@tabler/icons-react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export const NavBar: React.FC = () => {
  const { usuario, logout } = useAuth() as { usuario: { tipoUsuario: string } | null; logout: () => void }
  const navigate = useNavigate()

  if (!usuario) return null

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Sidebar className="h-screen border-r border-[#e7d9cd] bg-[#fffaf5] text-[#7a5b4c]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-[#f4e9e1] transition-colors rounded-md">
              <Link to="/menu-admin" className="flex items-center gap-2 text-[#7a5b4c] hover:text-[#5d3f2d]">
                <IconLayoutDashboard className="h-5 w-5" />
                <span className="text-lg font-semibold">JMBROWS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {usuario.tipoUsuario === 'Administrador' && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/empleados" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Empleados
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/periodos-laborales" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Periodos Laborales
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/servicios" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Servicios
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/sucursales" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Sucursales
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/sectores" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Sectores
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/habilidades" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Habilidades
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-[#f4e9e1] transition-colors rounded-md"
                >
                  <Link to="/asignarTurno" className="flex items-center gap-2 px-2 py-2">
                    <IconCalendarCheck className="h-5 w-5" />
                    Gestión Turnos
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 text-[#a1452f] hover:bg-[#a1452f] hover:text-white transition-colors rounded-md"
            >
              <IconLogout className="h-5 w-5" />
              Cerrar sesión
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
