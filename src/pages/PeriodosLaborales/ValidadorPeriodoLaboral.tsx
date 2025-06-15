export interface PeriodoLaboralFormData {
  empleadaId: number | '';
  desde: string;
  hasta: string;
  motivo: string;
  esLicencia: boolean;
}

export function validarPeriodoLaboral(form: PeriodoLaboralFormData): Partial<Record<keyof PeriodoLaboralFormData, string>> {
  const errores: Partial<Record<keyof PeriodoLaboralFormData, string>> = {};
  if (!form.empleadaId || form.empleadaId <=0) errores.empleadaId = "Debe seleccionar una empleada";
  if (!form.desde) errores.desde = "Debe ingresar la fecha de inicio";
  if (!form.hasta) errores.hasta = "Debe ingresar la fecha de fin";
  // Puedes agregar más validaciones si lo necesitas
  return errores;
}