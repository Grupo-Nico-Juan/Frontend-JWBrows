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
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  if (!usuario) return null

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <Sidebar className="h-screen border-r bg-white">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-2">
              <Link to="/menu-admin" className="flex items-center gap-2">
                <IconLayoutDashboard className="h-5 w-5" />
                <span className="text-lg font-semibold">JMBROWS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {usuario.tipoUsuario === "Administrador" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/empleados/nuevo" className="flex items-center gap-2 px-2 py-2">
                    <IconUserPlus className="h-5 w-5" />
                    Alta Usuario
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
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
              className="flex items-center gap-2 px-2 py-2 text-red-600"
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
