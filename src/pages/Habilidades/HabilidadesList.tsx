import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Habilidad {
  id: number;
  nombre: string;
  descripcion: string;
}

const HabilidadesList: React.FC = () => {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/Habilidad')
      .then(res => setHabilidades(res.data))
      .catch(() => setError('Error al cargar habilidades'));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta habilidad?')) return;
    try {
      await axios.delete(`/api/Habilidad/${id}`);
      setHabilidades(habilidades.filter(h => h.id !== id));
    } catch {
      setError('No se pudo eliminar la habilidad');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-[#7c3aed]">Habilidades</h2>
      <Button
        className="mb-4"
        onClick={() => navigate('/habilidades/nueva')}
      >
        + Nueva Habilidad
      </Button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="w-full border-collapse bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {habilidades.map(habilidad => (
            <tr key={habilidad.id}>
              <td className="border p-2">{habilidad.nombre}</td>
              <td className="border p-2">{habilidad.descripcion}</td>
              <td className="border p-2">
                <Button
                  onClick={() => navigate(`/habilidades/editar/${habilidad.id}`)}
                  className="mr-2"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(habilidad.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {habilidades.length === 0 && (
            <tr>
              <td colSpan={3} className="border p-2 text-center">No hay habilidades registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HabilidadesList;