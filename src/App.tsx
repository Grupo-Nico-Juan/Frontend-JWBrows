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


function App() {


  return (
    <MainLayout>
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />+
          <Route path="/altaUsuario" element={<AltaUsuario />} />
          <Route path="/menu-admin" element={<MenuAdmin />} />
          <Route path="/empleados" element={<EmpleadosList />} />
          <Route path="/empleados/nuevo" element={<EmpleadoForm />} />
          <Route path="/empleados/editar/:id" element={<EmpleadoForm />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path='/asignarTurno' element={<AsignarTurno />} />
      </Routes>
    </MainLayout>

  );
}

export default App;
