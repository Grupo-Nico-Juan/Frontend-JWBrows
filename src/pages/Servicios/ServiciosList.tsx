import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  precio: number;
  sucursalId: number;
  sectorId: number;
}

interface Sucursal {
  id: number;
  nombre: string;
}

interface Sector {
  id: number;
  nombre: string;
  sucursalId: number;
}

const ServiciosList: React.FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [sucursalId, setSucursalId] = useState<number | ''>('');
  const [sectorId, setSectorId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/Servicio')
      .then(res => setServicios(res.data))
      .catch(() => setError('Error al cargar servicios'));
    axios.get('/api/Sucursal')
      .then(res => setSucursales(res.data))
      .catch(() => setError('Error al cargar sucursales'));
    axios.get('/api/Sector')
      .then(res => setSectores(res.data))
      .catch(() => setError('Error al cargar sectores'));
  }, []);

  // Filtrar sectores por sucursal seleccionada
  const sectoresFiltrados = sucursalId
    ? sectores.filter(s => s.sucursalId === sucursalId)
    : sectores;

  // Filtrar servicios por sucursal y sector seleccionados
  const serviciosFiltrados = servicios.filter(servicio => {
    if (sucursalId && servicio.sucursalId !== sucursalId) return false;
    if (sectorId && servicio.sectorId !== sectorId) return false;
    return true;
  });

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
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-[#7c3aed]">Servicios</h2>
      <div className="flex gap-4 mb-4">
        <select
          className="border rounded px-3 py-2"
          value={sucursalId === '' ? '' : String(sucursalId)}
          onChange={e => {
            const value = e.target.value === '' ? '' : Number(e.target.value);
            setSucursalId(value);
            setSectorId(''); // reset sector al cambiar sucursal
          }}
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={sectorId === '' ? '' : String(sectorId)}
          onChange={e => setSectorId(e.target.value === '' ? '' : Number(e.target.value))}
          disabled={!sucursalId}
        >
          <option value="">Todos los sectores</option>
          {sectoresFiltrados.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <Button onClick={() => navigate('/servicios/nuevo')}>+ Nuevo Servicio</Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full border-collapse bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Duración</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {serviciosFiltrados.map(servicio => (
            <tr key={servicio.id}>
                  <td className="border p-2">{servicio.nombre}</td>
              <td className="border p-2">{servicio.descripcion}</td>
              <td className="border p-2">{servicio.duracionMinutos} min</td>
              <td className="border p-2">${servicio.precio}</td>
              <td className="border p-2">
                <Button
                  onClick={() => navigate(`/servicios/editar/${servicio.id}`)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(servicio.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {serviciosFiltrados.length === 0 && (
            <tr>
              <td colSpan={5} className="border p-2 text-center">No hay servicios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiciosList;