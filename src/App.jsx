import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AltaUsuario from './pages/AltaUsuario';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/altaUsuario" element={<AltaUsuario />} />
    </Routes>
  );
}

export default App;