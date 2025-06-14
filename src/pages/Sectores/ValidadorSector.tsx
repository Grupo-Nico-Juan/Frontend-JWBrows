export interface SectorFormData {
  nombre: string;
  descripcion: string;
  sucursalId: number | '';
}

export function validarSector(form: SectorFormData): Partial<Record<keyof SectorFormData, string>> {
  const errores: Partial<Record<keyof SectorFormData, string>> = {};
  if (!form.nombre?.trim()) errores.nombre = "El nombre es obligatorio";
  if (!form.descripcion?.trim()) errores.descripcion = "La descripción es obligatoria";
  if (form.sucursalId === '' || form.sucursalId === 0) errores.sucursalId = "Debe seleccionar una sucursal";
  return errores;
}