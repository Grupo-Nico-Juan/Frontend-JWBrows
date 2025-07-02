export interface ServicioFormValues {
  nombre: string;
  descripcion: string;
  duracionMinutos: number | '';
  precio: number | '';
}

export function validarServicio(form: ServicioFormValues): Partial<Record<keyof ServicioFormValues, string>> {
  const errores: Partial<Record<keyof ServicioFormValues, string>> = {};
  if (!form.nombre?.trim()) errores.nombre = "El nombre es obligatorio";
  if (!form.descripcion?.trim()) errores.descripcion = "La descripción es obligatoria";
  if (form.duracionMinutos === '' || form.duracionMinutos <= 0) errores.duracionMinutos = "La duración debe ser mayor a 0";
  if (form.precio === '' || form.precio < 0) errores.precio = "El precio no puede ser negativo";
  return errores;
}