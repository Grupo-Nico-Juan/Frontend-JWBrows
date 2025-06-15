import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { validarPeriodoLaboral, PeriodoLaboralFormData } from './ValidadorPeriodoLaboral';

interface Empleada {
  id: number;
  nombre: string;
  apellido: string;
}

const PeriodoLaboralForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const empleadaIdFromQuery = new URLSearchParams(location.search).get('empleadaId');
  const editando = !!id;

  const [form, setForm] = useState<PeriodoLaboralFormData>({
    empleadaId: empleadaIdFromQuery ? Number(empleadaIdFromQuery) : '',
    desde: '',
    hasta: '',
    motivo: '',
    esLicencia: false
  });

  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof PeriodoLaboralFormData, string>>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get('/api/Empleado')
      .then(res => {
        console.log('Empleadas:', res.data); // <-- Agrega esto
        setEmpleadas(res.data);
      })
      .catch(() => setError('No se pudieron cargar las empleadas'));
  }, []);

  useEffect(() => {
    if (editando && id) {
      axios
        .get(`/api/PeriodoLaboral/${id}`)
        .then((res) => setForm({
          empleadaId: res.data.empleadaId ?? '',
          desde: res.data.desde ? res.data.desde.substring(0, 10) : '',
          hasta: res.data.hasta ? res.data.hasta.substring(0, 10) : '',
          motivo: res.data.motivo ?? '',
          esLicencia: res.data.esLicencia ?? false
        }))
        .catch(() => setError('No se pudo cargar el periodo laboral'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'empleadaId'
          ? value === '' ? '' : Number(value)
          : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevosErrores = validarPeriodoLaboral(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setError('');
    try {
      if (editando && id) {
        await axios.put(`/api/PeriodoLaboral/${id}`, { ...form, id: Number(id) });
        toast.success('Periodo laboral actualizado correctamente');
      } else {
        await axios.post('/api/PeriodoLaboral', form);
        toast.success('Periodo laboral creado correctamente');
      }
      navigate(`/periodos-laborales?empleadaId=${form.empleadaId}`);
    } catch (err) {
      setError('Error al guardar periodo laboral');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-lg p-6 shadow-xl border border-[#e6dcd4] bg-[#fffaf5]">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-[#6e4b3a]">
              {editando ? 'Editar Periodo Laboral' : 'Nuevo Periodo Laboral'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="empleadaId"
                value={form.empleadaId === '' ? '' : String(form.empleadaId)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!!empleadaIdFromQuery && empleadaIdFromQuery !== 'null'}
              >
                <option value="">Seleccionar empleada</option>
                {empleadas.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                ))}
              </select>
              {errores.empleadaId && <p className="text-sm text-red-500">{errores.empleadaId}</p>}
              <Input
                name="desde"
                type="date"
                placeholder="Desde"
                value={form.desde}
                onChange={handleChange}
                required
              />
              {errores.desde && <p className="text-sm text-red-500">{errores.desde}</p>}
              <Input
                name="hasta"
                type="date"
                placeholder="Hasta"
                value={form.hasta}
                onChange={handleChange}
                required
              />
              {errores.hasta && <p className="text-sm text-red-500">{errores.hasta}</p>}
              <Input
                name="motivo"
                placeholder="Motivo (opcional)"
                value={form.motivo}
                onChange={handleChange}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="esLicencia"
                  checked={form.esLicencia}
                  onChange={handleChange}
                  id="esLicencia"
                />
                <label htmlFor="esLicencia">¿Es licencia?</label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-beish"
                    onClick={() => navigate(`/periodos-laborales?empleadaId=${form.empleadaId}`)}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="btn-jmbrows"
                  >
                    {editando ? 'Guardar cambios' : 'Crear periodo'}
                  </Button>
                </motion.div>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PeriodoLaboralForm;