"use client"

import type React from "react"
import MotionWrapper from "@/components/animations/motion-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface FechaHoraSectionProps {
  date: Date | undefined
  time: string
  calendarOpen: boolean
  horarioValido: boolean | null
  loadingHorarios: boolean
  onDateChange: (date: Date | undefined) => void
  onTimeChange: (time: string) => void
  onCalendarOpenChange: (open: boolean) => void
}

const FechaHoraSection: React.FC<FechaHoraSectionProps> = ({
  date,
  time,
  calendarOpen,
  horarioValido,
  loadingHorarios,
  onDateChange,
  onTimeChange,
  onCalendarOpenChange,
}) => {
  return (
    <MotionWrapper animation="slideLeft" delay={0.3}>
      <Card className="bg-white/80 backdrop-blur-sm border-[#e0d6cf]">
        <CardHeader>
          <CardTitle className="text-lg text-[#6d4c41] flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Fecha y Hora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Fecha
              </Label>
              <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal border-[#e0d6cf] focus:border-[#a1887f] bg-transparent"
                  >
                    {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      onDateChange(date)
                      onCalendarOpenChange(false)
                    }}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-[#6d4c41] flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora
              </Label>
              <div className="relative">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className={`border-[#e0d6cf] focus:border-[#a1887f] ${
                    horarioValido === false ? "border-red-500" : horarioValido === true ? "border-green-500" : ""
                  }`}
                />
                {loadingHorarios && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#a1887f]" />
                  </div>
                )}
              </div>

              {/* Indicador de disponibilidad */}
              {horarioValido === true && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="h-3 w-3" />
                  Horario disponible
                </div>
              )}
              {horarioValido === false && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  Horario no disponible
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionWrapper>
  )
}

export default FechaHoraSection
