"use client"

import type React from "react"

import { useState } from "react"

interface UseFormDataOptions<T> {
  initialData: T
  onSubmit?: (data: T) => Promise<void> | void
  validate?: (data: T) => string | null
}

export function useFormData<T extends Record<string, any>>({ initialData, onSubmit, validate }: UseFormDataOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? Number(value) : value,
    }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (validate) {
      const validationError = validate(formData)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    if (onSubmit) {
      setIsLoading(true)
      try {
        await onSubmit(formData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al procesar los datos")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData(initialData)
    setError("")
    setIsLoading(false)
  }

  return {
    formData,
    setFormData,
    error,
    setError,
    isLoading,
    setIsLoading,
    handleChange,
    handleSubmit,
    resetForm,
  }
}
