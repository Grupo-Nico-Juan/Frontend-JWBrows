export interface SucursalFormData {
  nombre: string;
  direccion: string;
  telefono: string;
}

export function validarSucursal(form: SucursalFormData): Partial<Record<keyof SucursalFormData, string>> {
  const errores: Partial<Record<keyof SucursalFormData, string>> = {};
  if (!form.nombre?.trim()) errores.nombre = "El nombre es obligatorio";
  if (!form.direccion?.trim()) errores.direccion = "La dirección es obligatoria";
  if (!form.telefono?.trim()) errores.telefono = "El teléfono es obligatorio";
  else if (!/^\d{7,15}$/.test(form.telefono)) errores.telefono = "El teléfono debe tener entre 7 y 15 dígitos";
  return errores;
}