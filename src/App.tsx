import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AltaUsuario from './pages/AltaUsuario';
import MenuAdmin from './pages/MenuAdmin';
import EmpleadosList from './pages/EmpleadosList';
import EmpleadoForm from './pages/EmpleadoForm';
import Turnos from './pages/Turnos';
import AsignarTurno from './pages/AsignarTurno';
import MainLayout from './pages/MainLayout';
import ServiciosList from './pages/Servicios/ServiciosList';
import ServicioForm from './pages/Servicios/ServicioForm';
import SucursalesList from './pages/Sucursales/SucursalesList';
import SucursalForm from './pages/Sucursales/SucursalForm';
import SectoresList from './pages/Sectores/SectoresList';
import SectorForm from './pages/Sectores/SectorForm';
import HabilidadesList from './pages/Habilidades/HabilidadesList';
import HabilidadForm from './pages/Habilidades/HabilidadForm';
import PeriodosLaboralesList from './pages/PeriodosLaborales/PeriodosLaboralesList';
import PeriodoLaboralForm from './pages/PeriodosLaborales/PeriodoLaboralForm';
import SeleccionSucursal from './pages/Cliente/SeleccionSucursal';
import SeleccionServicio from './pages/Cliente/SeleccionServicio';
import SeleccionFechaHora from './pages/Cliente/SeleccionFechaYHora';
import SeleccionEmpleado from './pages/Cliente/SeleccionEmpleado';
import ConfirmacionTurno from './pages/Cliente/ConfirmacionTurno';
import AsignarHabilidadesEmpleado from './pages/Empleado/AsignarHabilidadesEmpleado';
import AsignarSectoresEmpleado from './pages/Empleado/AsignarSectoresEmpleado';
import AsignarHabilidadesServicio from './pages/Servicios/AsignarHabilidadesServicio';
import AsignarSectoresServicio from './pages/Servicios/AsignarSectoresServicio';
import AsignarExtrasServicio from './pages/Servicios/AsignarExtrasServicio';
import Dashboard from './pages/Dashboard/DashboardMetrica';
import SeleccionTipoReserva from './pages/Cliente/SeleccionTipoReserva';
import SeleccionEmpleadaPrimero from './pages/Cliente/SeleccionEmpleadaPrimero';
import SeleccionFechaHoraEmpleada from './pages/Cliente/seleccionFechaYHoraEmpleada';
import TurnosEmpleadasSector from './pages/Empleado/TurnosEmpleadasSector';
import SeleccionSucursalSector from './pages/Empleado/SeleccionSucursalSector';

function App() {


  return (

    <MainLayout>
      <Routes >
        <Route path="/admin" element={<Login />} />
        <Route path="/registro" element={<Registro />} />+
        <Route path="/altaUsuario" element={<AltaUsuario />} />
        <Route path="/menu-admin" element={<MenuAdmin />} />
        <Route path="/empleados" element={<EmpleadosList />} />
        <Route path="/empleados/nuevo" element={<EmpleadoForm />} />
        <Route path="/empleados/editar/:id" element={<EmpleadoForm />} />
        <Route path="/empleados/:id/habilidades" element={<AsignarHabilidadesEmpleado />} />
        <Route path="/empleados/:id/sectores" element={<AsignarSectoresEmpleado />} />
        <Route path="/turnos" element={<Turnos />} />
        <Route path='/asignarTurno' element={<AsignarTurno />} />
        <Route path="/servicios" element={<ServiciosList />} />
        <Route path="/servicios/nuevo" element={<ServicioForm />} />
        <Route path="/servicios/editar/:id" element={<ServicioForm />} />
        <Route path="/servicios/:id/habilidades" element={<AsignarHabilidadesServicio />} />
        <Route path="/servicios/:id/sectores" element={<AsignarSectoresServicio />} />
        <Route path="/servicios/:id/extras" element={<AsignarExtrasServicio />} />
        <Route path="/sucursales" element={<SucursalesList />} />
        <Route path="/sucursales/nueva" element={<SucursalForm />} />
        <Route path="/sucursales/editar/:id" element={<SucursalForm />} />
        <Route path="/sectores" element={<SectoresList />} />
        <Route path="/sectores/nuevo" element={<SectorForm />} />
        <Route path="/sectores/editar/:id" element={<SectorForm />} />
        <Route path="/habilidades" element={<HabilidadesList />} />
        <Route path="/habilidades/nueva" element={<HabilidadForm />} />
        <Route path="/habilidades/editar/:id" element={<HabilidadForm />} />
        <Route path="/periodos-laborales" element={<PeriodosLaboralesList />} />
        <Route path="/periodos-laborales/nuevo" element={<PeriodoLaboralForm />} />
        <Route path="/periodos-laborales/editar/:id" element={<PeriodoLaboralForm />} />
        <Route path="/" element={<SeleccionSucursal/>} />
        <Route path="/reserva/servicio" element={<SeleccionServicio />} />
        <Route path="/reserva/fecha-hora" element={<SeleccionFechaHora />} />
        <Route path="/reserva/empleado" element={<SeleccionEmpleado />} />
        <Route path="/reserva/confirmar" element={<ConfirmacionTurno />} />
        <Route path="/reserva/tipo" element={<SeleccionTipoReserva/>} />
        <Route path="/reserva/empleada-primero" element={<SeleccionEmpleadaPrimero/>} />
        <Route path="/reserva/fecha-hora-empleada" element={<SeleccionFechaHoraEmpleada />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/empleadas" element={<SeleccionSucursalSector />} />
        <Route path="/empleadas/turnos" element={<TurnosEmpleadasSector/>} />
      </Routes>
    </MainLayout>

  );
}

export default App;
