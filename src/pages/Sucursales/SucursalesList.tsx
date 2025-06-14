import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
}

const SucursalesList: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/Sucursal')
      .then(res => setSucursales(res.data))
      .catch(() => setError('Error al cargar sucursales'));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta sucursal?')) return;
    try {
      await axios.delete(`/api/Sucursal/${id}`);
      setSucursales(sucursales.filter(s => s.id !== id));
    } catch {
      setError('No se pudo eliminar la sucursal');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-[#7c3aed]">Sucursales</h2>
      <Button
        className="mb-4"
        onClick={() => navigate('/sucursales/nueva')}
      >
        + Nueva Sucursal
      </Button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full border-collapse bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Dirección</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map(sucursal => (
            <tr key={sucursal.id}>
              <td className="border p-2">{sucursal.nombre}</td>
              <td className="border p-2">{sucursal.direccion}</td>
              <td className="border p-2">{sucursal.telefono}</td>
              <td className="border p-2">
                <Button
                  onClick={() => navigate(`/sucursales/editar/${sucursal.id}`)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(sucursal.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {sucursales.length === 0 && (
            <tr>
              <td colSpan={4} className="border p-2 text-center">No hay sucursales registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SucursalesList;