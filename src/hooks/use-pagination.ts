"use client"

import { useState, useEffect, useMemo, useCallback } from "react"

interface UsePaginationProps<T> {
  data: T[]
  initialItemsPerPage?: number
}

interface UsePaginationReturn<T> {
  currentPage: number
  itemsPerPage: number
  totalPages: number
  paginatedData: T[]
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  resetToFirstPage: () => void
}

export function usePagination<T>({ data, initialItemsPerPage = 10 }: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage)

  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage])

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  // Reset a la primera página si la página actual es mayor que el total de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages]) // Removido currentPage de las dependencias para evitar loops

  // Reset a la primera página cuando cambian los datos (pero solo si es necesario)
  useEffect(() => {
    if (data.length === 0) {
      setCurrentPage(1)
    }
  }, [data.length]) // Solo cuando cambia la longitud de los datos

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    setItemsPerPage,
    resetToFirstPage,
  }
}
