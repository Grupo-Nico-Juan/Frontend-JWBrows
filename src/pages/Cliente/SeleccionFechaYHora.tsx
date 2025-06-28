import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScrollFadeWrapper from "@/components/ui/ScrollFadeWrapper";
import { motion } from "framer-motion";
import { useTurno } from "@/context/TurnoContext";

const horariosLaborales: Record<string, { inicio: string; fin: string } | null> = {
  Monday: { inicio: "14:00", fin: "18:00" },
  Tuesday: { inicio: "10:00", fin: "18:00" },
  Wednesday: { inicio: "10:00", fin: "18:00" },
  Thursday: { inicio: "10:00", fin: "18:00" },
  Friday: { inicio: "10:00", fin: "18:00" },
  Saturday: { inicio: "10:00", fin: "14:00" },
  Sunday: null,
};

function generarFranjas(horaInicio: string, horaFin: string) {
  const franjas: string[] = [];
  const [hi, mi] = horaInicio.split(":" ).map(Number);
  const [hf, mf] = horaFin.split(":" ).map(Number);
  const start = new Date(0, 0, 0, hi, mi);
  const end = new Date(0, 0, 0, hf, mf);
  while (start < end) {
    franjas.push(start.toTimeString().slice(0, 5));
    start.setMinutes(start.getMinutes() + 15);
  }
  return franjas;
}

const SeleccionFechaHora: React.FC = () => {
  const navigate = useNavigate();
  const { setFechaHora } = useTurno();

  const dias = Array.from({ length: 7 }).map((_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);
    const key = fecha.toLocaleDateString("en-US", { weekday: "long" });
    const horario = horariosLaborales[key];
    return { fecha, horario };
  });

  const [indiceActivo, setIndiceActivo] = useState(0);

  const handleSelect = (fecha: Date, hora: string) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    const fechaHora = `${fechaStr}T${hora}:00`;
    setFechaHora(fechaHora);
    navigate("/reserva/empleado");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf6f1]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-4 bg-[#fffaf5] border border-[#e6dcd4] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#6e4b3a]">Seleccioná día y hora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ScrollFadeWrapper>
              {dias.map(({ fecha }, i) => (
                <motion.button
                  key={fecha.toDateString()}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-md whitespace-nowrap btn-beish ${i === indiceActivo ? "bg-[#e7ddd3]" : ""}`}
                  onClick={() => setIndiceActivo(i)}
                >
                  {fecha.toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "2-digit" })}
                </motion.button>
              ))}
            </ScrollFadeWrapper>

            {(() => {
              const { fecha, horario } = dias[indiceActivo];
              return horario ? (
                <div className="grid grid-cols-3 gap-2">
                  {generarFranjas(horario.inicio, horario.fin).map((h) => (
                    <motion.div key={h} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSelect(fecha, h)}
                      >
                        {h}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin horario disponible</p>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SeleccionFechaHora;