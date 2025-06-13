import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  precio: number;
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: 24,
  background: '#fff',
  borderRadius: 8,
  boxShadow: '0 2px 8px #0001'
};

const thtdStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: 8,
  textAlign: 'left'
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  marginRight: 8,
  borderRadius: 4,
  border: 'none',
  background: '#7c3aed',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer'
};

const ServiciosList: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/Servicio')
      .then(res => setServicios(res.data))
      .catch(() => setError('Error al cargar servicios'));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await axios.delete(`/api/Servicio/${id}`);
      setServicios(servicios.filter(s => s.id !== id));
    } catch {
      setError('No se pudo eliminar el servicio');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h2 style={{ color: '#7c3aed' }}>Servicios</h2>
      <button
        style={{ ...buttonStyle, marginBottom: 16, background: '#10b981' }}
        onClick={() => navigate('/servicios/nuevo')}
      >
        + Nuevo Servicio
      </button>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thtdStyle}>Nombre</th>
            <th style={thtdStyle}>Descripción</th>
            <th style={thtdStyle}>Duración (min)</th>
            <th style={thtdStyle}>Precio</th>
            <th style={thtdStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(servicio => (
            <tr key={servicio.id}>
              <td style={thtdStyle}>{servicio.nombre}</td>
              <td style={thtdStyle}>{servicio.descripcion}</td>
              <td style={thtdStyle}>{servicio.duracionMinutos}</td>
              <td style={thtdStyle}>${servicio.precio}</td>
              <td style={thtdStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
                >
                  Editar
                </button>
                <button
                  style={{ ...buttonStyle, background: '#ef4444' }}
                  onClick={() => handleDelete(servicio.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {servicios.length === 0 && (
            <tr>
              <td style={thtdStyle} colSpan={5}>No hay servicios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiciosList;