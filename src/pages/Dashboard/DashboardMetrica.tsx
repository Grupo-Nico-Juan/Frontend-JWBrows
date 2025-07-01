import React, { useEffect, useState } from "react"
import IngresosSucursalPorCategoria from "./Componentes/IngresosSucursalPorCategoria"
import CitasConfirmadasCanceladas from "./Componentes/CitasConfirmadasCanceladas"
//import CitasPorServicio from "./Componentes/CitasPorServicio"
// import HorarioConMasCitas from "./Componentes/HorarioConMasCitas"

const Dashboard: React.FC = () => {
  const [anio, setAnio] = useState<number>(new Date().getFullYear())
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1)

  const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [anioStr, mesStr] = e.target.value.split("-")
    setAnio(parseInt(anioStr))
    setMes(parseInt(mesStr))
  }

  return (
    <div className="px-6 py-8 bg-[#fdf6f1] min-h-screen">
      <h1 className="text-3xl font-bold text-[#6e4b3a] mb-8">Dashboard de Métricas</h1>

      <div className="mb-6">
        <label className="block text-[#6e4b3a] font-medium mb-2">
          Seleccionar mes y año:
        </label>
        <input
          type="month"
          value={`${anio}-${mes.toString().padStart(2, "0")}`}
          onChange={handleFechaChange}
          className="border border-[#d2bfae] rounded px-3 py-2 text-[#6e4b3a]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <IngresosSucursalPorCategoria anio={anio} mes={mes} />
        <CitasConfirmadasCanceladas anio={anio} mes={mes} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <CitasPorServicio anio={anio} mes={mes} />
        <HorarioConMasCitas anio={anio} mes={mes} /> */}
      </div>
    </div>
  )
}

export default Dashboard