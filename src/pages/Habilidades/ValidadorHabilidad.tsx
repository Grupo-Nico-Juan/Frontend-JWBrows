export interface HabilidadFormData {
  nombre: string;
  descripcion: string;
}

export function validarHabilidad(form: HabilidadFormData): Partial<Record<keyof HabilidadFormData, string>> {
  const errores: Partial<Record<keyof HabilidadFormData, string>> = {};
  if (!form.nombre?.trim()) errores.nombre = "El nombre es obligatorio";
  if (!form.descripcion?.trim()) errores.descripcion = "La descripción es obligatoria";
  return errores;
}