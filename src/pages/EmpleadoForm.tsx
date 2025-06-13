import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EmpleadoFormData {
  nombre: string;
  apellido: string;
  email: string;
  passwordPlano: string;
  cargo: string;
}

const EmpleadoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<EmpleadoFormData>({
    nombre: '',
    apellido: '',
    email: '',
    passwordPlano: '',
    cargo: '',
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editando && id) {
      axios
        .get<EmpleadoFormData>(`/api/Empleado/${id}`)
        .then((res) => setForm({ ...res.data, passwordPlano: '' }))
        .catch(() => setError('No se pudo cargar el empleado'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      if (editando && id) {
        const { passwordPlano, ...rest } = form;
        await axios.put(`/api/Empleado/${id}`, passwordPlano ? form : rest);
        toast.success('Empleado actualizado correctamente');
      } else {
        await axios.post('/api/Empleado', form);
        toast.success('Empleado creado correctamente');
      }
      navigate('/empleados');
    } catch (err) {
      setError('Error al guardar empleado');
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
              {editando ? 'Editar Empleado' : 'Nuevo Empleado'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="nombre"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="apellido"
                  placeholder="Apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={editando}
                />
                <Input
                  name="passwordPlano"
                  type="password"
                  placeholder={editando ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  value={form.passwordPlano}
                  onChange={handleChange}
                  required={!editando}
                />
              </div>
              <Input
                name="cargo"
                placeholder="Cargo"
                value={form.cargo}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-beish"
                    onClick={() => navigate('/empleados')}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    className="btn-jmbrows"
                  >
                    {editando ? 'Guardar cambios' : 'Crear empleado'}
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

export default EmpleadoForm;
