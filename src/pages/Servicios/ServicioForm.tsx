import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from '../../api/AxiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Sucursal {
  id: number;
  nombre: string;
}

interface Sector {
  id: number;
  nombre: string;
  sucursalId: number;
}

interface ServicioFormData {
  nombre: string;
  descripcion: string;
  duracionMinutos: number | '';
  precio: number | '';
  sucursalId: number | '';
  sectorId: number | '';
}

const ServicioForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const editando = !!id;

  const [form, setForm] = useState<ServicioFormData>({
    nombre: '',
    descripcion: '',
    duracionMinutos: '',
    precio: '',
    sucursalId: '',
    sectorId: ''
  });

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [error, setError] = useState<string>('');

  // Cargar sucursales al montar
  useEffect(() => {
    axios.get('/api/Sucursal')
      .then(res => setSucursales(res.data))
      .catch(() => setError('No se pudieron cargar las sucursales'));
  }, []);

  // Cargar sectores cuando cambia la sucursal seleccionada
  useEffect(() => {
    if (form.sucursalId) {
      axios.get(`/api/Sector`)
        .then(res => {
          // Filtrar sectores por sucursal seleccionada
          setSectores(res.data.filter((s: Sector) => s.sucursalId === form.sucursalId));
        })
        .catch(() => setError('No se pudieron cargar los sectores'));
    } else {
      setSectores([]);
      setForm(f => ({ ...f, sectorId: '' }));
    }
  }, [form.sucursalId]);

  // Cargar datos del servicio si está en modo edición
  useEffect(() => {
    if (editando && id) {
      axios
        .get(`/api/Servicio/${id}`)
        .then((res) => {
          setForm({
            nombre: res.data.nombre ?? '',
            descripcion: res.data.descripcion ?? '',
            duracionMinutos: res.data.duracionMinutos ?? '',
            precio: res.data.precio ?? '',
            sucursalId: res.data.sucursalId ?? '',
            sectorId: res.data.sectorId ?? ''
          });
        })
        .catch(() => setError('No se pudo cargar el servicio'));
    }
  }, [editando, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === 'duracionMinutos' || name === 'precio'
          ? value === '' ? '' : Number(value)
          : name === 'sucursalId' || name === 'sectorId'
          ? value === '' ? '' : Number(value)
          : value
    }));
    // Si cambia la sucursal, resetea el sector
    if (name === 'sucursalId') {
      setForm(f => ({ ...f, sectorId: '' }));
    }
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
              <select
                name="sucursalId"
                value={form.sucursalId === '' ? '' : String(form.sucursalId)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              <select
                name="sectorId"
                value={form.sectorId === '' ? '' : String(form.sectorId)}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
                disabled={!form.sucursalId}
              >
                <option value="">Seleccionar sector</option>
                {sectores.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
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
