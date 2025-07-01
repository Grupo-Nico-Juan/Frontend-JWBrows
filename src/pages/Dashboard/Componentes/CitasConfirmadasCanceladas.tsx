import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import axios from "axios"

type EstadoTurnosResponse = {
  realizados: number
  cancelados: number
}

interface Props {
  anio: number
  mes: number
}


const CitasConfirmadasCanceladas: React.FC<Props> = ({ anio, mes }) => {
  const [data, setData] = useState<EstadoTurnosResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get<EstadoTurnosResponse>(
          `/api/Reportes/estado-turnos`, {
        params: {
          anio: anio,
          mes: mes,
        },
      })
        setData(data)
      } catch (error) {
        console.error("Error al cargar estado de turnos:", error)
      }
    }

    fetchData()
  }, [])

  if (!data) return null

  const chartData = [
    {
      estado: "Realizados",
      cantidad: data.realizados,
      fill: "var(--chart-1)",
    },
    {
      estado: "Cancelados",
      cantidad: data.cancelados,
      fill: "var(--chart-2)",
    },
  ]

  const chartConfig = {
    cantidad: { label: "Cantidad" },
    realizados: { label: "Realizados", color: "var(--chart-1)" },
    cancelados: { label: "Cancelados", color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Citas Confirmadas vs Canceladas</CardTitle>
        <CardDescription>Junio 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="cantidad" nameKey="estado" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Estado de los turnos este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Confirmados: {data.realizados} | Cancelados: {data.cancelados}
        </div>
      </CardFooter>
    </Card>
  )
}


export default CitasConfirmadasCanceladas;