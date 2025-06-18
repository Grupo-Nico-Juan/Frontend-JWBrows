import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Empleada {
  id: number;
  nombre: string;
  apellido: string;
}

interface PeriodoLaboralFormData {
  empleadaId: number | '';
  tipo: 'HorarioHabitual' | 'Licencia';
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  desde: string;
  hasta: string;
  motivo: string;
}

const diasSemana = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const PeriodoLaboralForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const empleadaIdFromQuery = new URLSearchParams(location.search).get('empleadaId');
  const editando = !!id;

  const [empleadas, setEmpleadas] = useState<Empleada[]>([]);
  const [form, setForm] = useState<PeriodoLaboralFormData>({
    empleadaId: empleadaIdFromQuery ? Number(empleadaIdFromQuery) : '',
    tipo: 'HorarioHabitual',
    diaSemana: 'Monday',
    horaInicio: '',
    horaFin: '',
    desde: '',
    hasta: '',
    motivo: ''
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios.get('/api/Empleado')
      .then(res => setEmpleadas(res.data))
      .catch(() => setError('No se pudieron cargar las empleadas'));
  }, []);

  useEffect(() => {
    if (editando && id) {
      axios.get(`/api/PeriodoLaboral/${id}`)
        .then(res => {
          const data = res.data;
          setForm({
            empleadaId: data.empleadaId,
            tipo: data.tipo,
            diaSemana: data.diaSemana ?? 'Monday',
            horaInicio: data.horaInicio ?? '',
            horaFin: data.horaFin ?? '',
            desde: data.desde ? data.desde.substring(0, 10) : '',
            hasta: data.hasta ? data.hasta.substring(0, 10) : '',
            motivo: data.motivo ?? ''
          });
        })
        .catch(() => setError('Error al cargar el período laboral'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const dataToSend = {
      empleadaId: form.empleadaId,
      tipo: form.tipo,
      diaSemana: form.tipo === 'HorarioHabitual' ? form.diaSemana : null,
      horaInicio: form.tipo === 'HorarioHabitual' ? form.horaInicio : null,
      horaFin: form.tipo === 'HorarioHabitual' ? form.horaFin : null,
      desde: form.tipo === 'Licencia' ? form.desde : null,
      hasta: form.tipo === 'Licencia' ? form.hasta : null,
      motivo: form.tipo === 'Licencia' ? form.motivo : null
    };

    const request = editando && id
      ? axios.put(`/api/PeriodoLaboral/${id}`, dataToSend)
      : axios.post('/api/PeriodoLaboral', dataToSend);

    request
      .then(() => {
        toast.success(`Periodo laboral ${editando ? 'actualizado' : 'creado'} correctamente`);
        navigate(`/periodos-laborales?empleadaId=${form.empleadaId}`);
      })
      .catch(() => setError('Error al guardar el período laboral'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
                value={form.empleadaId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seleccionar empleada</option>
                {empleadas.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                ))}
              </select>

              <select name="tipo" value={form.tipo} onChange={handleChange} className="w-full border rounded px-3 py-2">
                <option value="HorarioHabitual">Horario Habitual</option>
                <option value="Licencia">Licencia</option>
              </select>

              {form.tipo === 'HorarioHabitual' && (
                <>
                  <select name="diaSemana" value={form.diaSemana} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    {diasSemana.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                  </select>
                  <Input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} required />
                  <Input type="time" name="horaFin" value={form.horaFin} onChange={handleChange} required />
                </>
              )}

              {form.tipo === 'Licencia' && (
                <>
                  <Input type="date" name="desde" value={form.desde} onChange={handleChange} required />
                  <Input type="date" name="hasta" value={form.hasta} onChange={handleChange} required />
                  <Input name="motivo" placeholder="Motivo (opcional)" value={form.motivo} onChange={handleChange} />
                </>
              )}

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
                  <Button type="submit" className="btn-jmbrows">
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