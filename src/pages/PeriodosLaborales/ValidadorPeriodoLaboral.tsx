export interface PeriodoLaboralFormData {
  empleadaId: number | '';
  desde: string;
  hasta: string;
  motivo: string;
  esLicencia: boolean;
  diaSemana?: string;      // Para horario habitual
  horaInicio?: string;     // Para horario habitual
  horaFin?: string;        // Para horario habitual
}

export function validarPeriodoLaboral(form: PeriodoLaboralFormData): Partial<Record<keyof PeriodoLaboralFormData, string>> {
  const errores: Partial<Record<keyof PeriodoLaboralFormData, string>> = {};

  if (!form.empleadaId || form.empleadaId <= 0) errores.empleadaId = "Debe seleccionar una empleada";

  if (form.esLicencia) {
    // Validaciones para licencia
    if (!form.desde) errores.desde = "Debe ingresar la fecha de inicio";
    if (!form.hasta) errores.hasta = "Debe ingresar la fecha de fin";
    if (form.diaSemana) errores.diaSemana = "No debe especificar día de semana para una licencia";
    if (form.horaInicio) errores.horaInicio = "No debe especificar hora de inicio para una licencia";
    if (form.horaFin) errores.horaFin = "No debe especificar hora de fin para una licencia";
    if (!form.motivo || form.motivo.trim() === "") errores.motivo = "Debe ingresar el motivo de la licencia";
  } else {
    // Validaciones para horario habitual
    if (!form.diaSemana) errores.diaSemana = "Debe seleccionar el día de la semana";
    if (!form.horaInicio) errores.horaInicio = "Debe ingresar la hora de inicio";
    if (!form.horaFin) errores.horaFin = "Debe ingresar la hora de fin";
    if (form.desde) errores.desde = "No debe especificar fecha de inicio para un horario habitual";
    if (form.hasta) errores.hasta = "No debe especificar fecha de fin para un horario habitual";
    if (form.motivo) errores.motivo = "No debe ingresar motivo para un horario habitual";
  }

  return errores;
}