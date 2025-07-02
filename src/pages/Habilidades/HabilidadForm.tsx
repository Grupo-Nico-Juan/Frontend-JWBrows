import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { validarHabilidad, HabilidadFormData } from './ValidadorHabilidad';

const HabilidadForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<HabilidadFormData>({
    nombre: '',
    descripcion: ''
  });

  const [errores, setErrores] = useState<Partial<Record<keyof HabilidadFormData, string>>>({});
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editando && id) {
      axios
        .get(`/api/Habilidad/${id}`)
        .then((res) => setForm({
          nombre: res.data.nombre ?? '',
          descripcion: res.data.descripcion ?? ''
        }))
        .catch(() => setError('No se pudo cargar la habilidad'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevosErrores = validarHabilidad(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setError('');
    try {
      if (editando && id) {
        await axios.put(`/api/Habilidad/${id}`, { ...form, id: Number(id) });
        toast.success('Habilidad actualizada correctamente');
      } else {
        await axios.post('/api/Habilidad', form);
        toast.success('Habilidad creada correctamente');
      }
      navigate('/habilidades');
    } catch (err) {
      setError('Error al guardar habilidad');
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
              {editando ? 'Editar Habilidad' : 'Nueva Habilidad'}
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
              <div className="flex justify-end gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-beish"
                    onClick={() => navigate('/habilidades')}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="btn-jmbrows"
                  >
                    {editando ? 'Guardar cambios' : 'Crear habilidad'}
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

export default HabilidadForm;