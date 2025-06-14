import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Sector {
  id: number;
  nombre: string;
  descripcion: string | null;
  sucursalId: number;
}

interface Sucursal {
  id: number;
  nombre: string;
}

const SectoresList: React.FC = () => {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get('/api/Sector'),
      axios.get('/api/Sucursal')
    ])
      .then(([sectoresRes, sucursalesRes]) => {
        setSucursales(sucursalesRes.data);
        setSectores(sectoresRes.data);
      })
      .catch(() => setError('Error al cargar sectores o sucursales'));
  }, []);

  const getSucursalNombre = (sucursalId: number) => {
    if (!sucursalId || sucursalId === 0) return 'Sin sucursal';
    const sucursal = sucursales.find(s => s.id === sucursalId);
    return sucursal ? sucursal.nombre : 'Sucursal desconocida';
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este sector?')) return;
    try {
      await axios.delete(`/api/Sector/${id}`);
      setSectores(sectores.filter(s => s.id !== id));
    } catch {
      setError('No se pudo eliminar el sector');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-[#7c3aed]">Sectores</h2>
      <Button
        className="mb-4"
        onClick={() => navigate('/sectores/nuevo')}
      >
        + Nuevo Sector
      </Button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full border-collapse bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Sucursal</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sectores.map(sector => (
            <tr key={sector.id}>
              <td className="border p-2">{sector.nombre}</td>
              <td className="border p-2">{sector.descripcion ?? ''}</td>
              <td className="border p-2">{getSucursalNombre(sector.sucursalId)}</td>
              <td className="border p-2">
                <Button
                  onClick={() => navigate(`/sectores/editar/${sector.id}`)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(sector.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {sectores.length === 0 && (
            <tr>
              <td colSpan={4} className="border p-2 text-center">No hay sectores registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SectoresList;