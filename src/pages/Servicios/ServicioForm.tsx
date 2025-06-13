import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ServicioFormData {
  nombre: string;
  descripcion: string;
  duracionMinutos: number | '';
  precio: number | '';
}

const ServicioForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<ServicioFormData>({
    nombre: '',
    descripcion: '',
    duracionMinutos: '',
    precio: ''
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editando && id) {
      axios
        .get<ServicioFormData>(`/api/Servicio/${id}`)
        .then((res) => setForm(res.data))
        .catch(() => setError('No se pudo cargar el servicio'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'duracionMinutos' || name === 'precio'
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (editando && id) {
        await axios.put(`/api/Servicio/${id}`, form);
        toast.success('Servicio actualizado correctamente');
      } else {
        await axios.post('/api/Servicio', form);
        toast.success('Servicio creado correctamente');
      }
      navigate('/servicios');
    } catch (err) {
      setError('Error al guardar servicio');
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
              {editando ? 'Editar Servicio' : 'Nuevo Servicio'}
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
              <Input
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
              <Input
                name="duracionMinutos"
                type="number"
                placeholder="Duración (minutos)"
                value={form.duracionMinutos}
                onChange={handleChange}
                required
                min={1}
              />
              <Input
                name="precio"
                type="number"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
                required
                min={0}
              />
              <div className="flex justify-end gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-beish"
                    onClick={() => navigate('/servicios')}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="btn-jmbrows"
                  >
                    {editando ? 'Guardar cambios' : 'Crear servicio'}
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

export default ServicioForm;
