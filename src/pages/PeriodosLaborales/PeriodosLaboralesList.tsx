import React, { useEffect, useState } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PeriodoLaboral {
  id: number;
  desde?: string;
  hasta?: string;
  motivo?: string;
  esLicencia: boolean;
  diaSemana?: string;
  horaInicio?: string;
  horaFin?: string;
}

const PeriodosLaboralesList: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoLaboral[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const empleadaId = new URLSearchParams(location.search).get('empleadaId');

  useEffect(() => {
    if (empleadaId) {
      axios.get(`/api/PeriodoLaboral/empleada/${empleadaId}`)
        .then(res => setPeriodos(res.data))
        .catch(() => setError('Error al cargar periodos laborales'));
    }
  }, [empleadaId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este periodo laboral?')) return;
    try {
      await axios.delete(`/api/PeriodoLaboral/${id}`);
      setPeriodos(periodos.filter(p => p.id !== id));
    } catch {
      setError('No se pudo eliminar el periodo laboral');
    }
  };

  const horarios = periodos.filter(p => !p.esLicencia);
  const licencias = periodos.filter(p => p.esLicencia);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl mb-4 text-[#7c3aed]">Periodos Laborales</h2>
      <Button
        className="mb-4"
        onClick={() => navigate(`/periodos-laborales/nuevo?empleadaId=${empleadaId}`)}
      >
        + Nuevo Periodo
      </Button>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Horarios Habituales */}
      <h3 className="text-xl mt-6 mb-2 text-[#7a5b4c]">Horarios Habituales</h3>
      {horarios.length === 0 ? (
        <div className="text-gray-500 mb-4">No hay horarios habituales registrados.</div>
      ) : (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-gray-700 bg-gray-100 rounded-t-lg">
            <div>Día</div>
            <div>Hora Inicio</div>
            <div>Hora Fin</div>
            <div className="text-center col-span-2">Acciones</div>
          </div>
          {horarios.map(periodo => (
            <div
              key={periodo.id}
              className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0"
            >
              <div>{periodo.diaSemana ?? '-'}</div>
              <div>{periodo.horaInicio ?? '-'}</div>
              <div>{periodo.horaFin ?? '-'}</div>
              <div className="flex justify-center col-span-2">
                <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => navigate(`/periodos-laborales/editar/${periodo.id}?empleadaId=${empleadaId}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="link"
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleDelete(periodo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Licencias */}
      <h3 className="text-xl mt-6 mb-2 text-[#7a5b4c]">Licencias</h3>
      {licencias.length === 0 ? (
        <div className="text-gray-500">No hay licencias registradas.</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-gray-700 bg-gray-100 rounded-t-lg">
            <div>Desde</div>
            <div>Hasta</div>
            <div>Motivo</div>
            <div className="text-center">Acciones</div>
          </div>
          {licencias.map(periodo => (
            <div
              key={periodo.id}
              className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0"
            >
              <div>{periodo.desde ? new Date(periodo.desde).toLocaleDateString('es-ES') : '-'}</div>
              <div>{periodo.hasta ? new Date(periodo.hasta).toLocaleDateString('es-ES') : '-'}</div>
              <div>{periodo.motivo ?? '-'}</div>
              <div className="flex justify-center">
                <Button
                  variant="link"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => navigate(`/periodos-laborales/editar/${periodo.id}?empleadaId=${empleadaId}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="link"
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => handleDelete(periodo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeriodosLaboralesList;