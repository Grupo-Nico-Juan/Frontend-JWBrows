import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmpleadosList = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario || usuario.tipoUsuario !== "Administrador") {
      navigate('/'); // Redirige si no es admin
      return;
    }
    const fetchEmpleados = async () => {
      try {
        const res = await axios.get('/api/Empleado');
        setEmpleados(res.data);
      } catch (err) {
        setError('Error al cargar empleados');
      }
    };
    fetchEmpleados();
  }, [usuario, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar empleado?')) return;
    try {
      await axios.delete(`/api/Empleado/${id}`);
      setEmpleados(empleados.filter(e => e.id !== id));
    } catch {
      setError('No se pudo eliminar el empleado');
    }
  };

  return (
    <div>
      <h2>Empleados</h2>
      <button onClick={() => navigate('/empleados/nuevo')}>Nuevo Empleado</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id}>
              <td>{emp.nombre}</td>
              <td>{emp.apellido}</td>
              <td>{emp.email}</td>
              <td>{emp.cargo}</td>
              <td>
                <button onClick={() => navigate(`/empleados/editar/${emp.id}`)}>Editar</button>
                <button onClick={() => handleDelete(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadosList;