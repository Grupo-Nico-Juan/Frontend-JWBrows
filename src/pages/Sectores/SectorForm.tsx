import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { validarSector, SectorFormData } from './ValidadorSector';

interface Sucursal {
  id: number;
  nombre: string;
}

const SectorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<SectorFormData>({
    nombre: '',
    descripcion: '',
    sucursalId: ''
  });

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [errores, setErrores] = useState<Partial<Record<keyof SectorFormData, string>>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Cargar sucursales para el select
    axios.get('/api/Sucursal')
      .then(res => setSucursales(res.data))
      .catch(() => setError('No se pudieron cargar las sucursales'));
  }, []);

  useEffect(() => {
    if (editando && id) {
      axios
        .get<SectorFormData>(`/api/Sector/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError('No se pudo cargar el sector'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'sucursalId'
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevosErrores = validarSector(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setError('');
    try {
      if (editando && id) {
        await axios.put(`/api/Sector/${id}`, { ...form, id: Number(id) });
        toast.success('Sector actualizado correctamente');
      } else {
        await axios.post('/api/Sector', form);
        toast.success('Sector creado correctamente');
      }
      navigate('/sectores');
    } catch (err) {
      setError('Error al guardar sector');
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
              {editando ? 'Editar Sector' : 'Nuevo Sector'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              {errores.nombre && <p className="text-sm text-red-500">{errores.nombre}</p>}
              <Input
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
              {errores.descripcion && <p className="text-sm text-red-500">{errores.descripcion}</p>}
              <select
                name="sucursalId"
                value={form.sucursalId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              {errores.sucursalId && <p className="text-sm text-red-500">{errores.sucursalId}</p>}
              <div className="flex justify-end gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-beish"
                    onClick={() => navigate('/sectores')}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="btn-jmbrows"
                  >
                    {editando ? 'Guardar cambios' : 'Crear sector'}
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

export default SectorForm;