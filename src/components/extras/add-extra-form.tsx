"use client"

import type React from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Star, Clock, DollarSign, Plus } from "lucide-react"
import FormSection from "@/components/forms/form-section"
import FormInputField from "@/components/forms/form-input-field"
import FormButtons from "@/components/forms/form-buttons"

interface Extra {
  nombre: string
  duracionMinutos: number
  precio: number
}

interface AddExtraFormProps {
  nuevo: Extra
  isAdding: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent) => Promise<void>
}

const AddExtraForm: React.FC<AddExtraFormProps> = ({ nuevo, isAdding, onChange, onSubmit }) => {
  return (
    <FormSection
      title="Agregar Nuevo Extra"
      icon={<Plus />}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="lg:col-span-2">
            <FormInputField
              id="nombre"
              name="nombre"
              label="Nombre del Extra"
              icon={<Star />}
              placeholder="Ej: Masaje adicional, Tratamiento premium..."
              value={nuevo.nombre}
              onChange={onChange}
              disabled={isAdding}
            />
          </div>
          <FormInputField
            id="duracionMinutos"
            name="duracionMinutos"
            label="Duración (min)"
            icon={<Clock />}
            type="number"
            placeholder="30"
            value={String(nuevo.duracionMinutos) || ""}
            onChange={onChange}
            disabled={isAdding}
          />
          <FormInputField
            id="precio"
            name="precio"
            label="Precio ($)"
            icon={<DollarSign />}
            type="number"
            placeholder="25.00"
            value={String(nuevo.precio) || ""}
            onChange={onChange}
            disabled={isAdding}
          />
        </div>
        <div className="flex justify-end">
          <FormButtons
            submitText="Agregar Extra"
            isLoading={isAdding}
            isEditing={false}
            disabled={isAdding || !nuevo.nombre.trim()}
            onCancel={() => {}}
          />
        </div>
      </form>
    </FormSection>
  )
}

export default AddExtraForm
