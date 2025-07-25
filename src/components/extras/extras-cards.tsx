"use client"

import type React from "react"
import { Star, Clock, DollarSign, Trash2, Loader2 } from "lucide-react"
import AnimatedCard from "@/components/common/animated-card"
import MotionWrapper from "@/components/animations/motion-wrapper"

interface Extra {
  id: number
  nombre: string
  duracionMinutos: number
  precio: number
}

interface ExtrasCardsProps {
  extras: Extra[]
  onDelete: (id: number) => Promise<void>
  loadingDelete: Set<number>
}

const ExtrasCards: React.FC<ExtrasCardsProps> = ({ extras, onDelete, loadingDelete }) => {
  return (
    <MotionWrapper animation="slideUp" delay={0.5} className="md:hidden space-y-3">
      {extras.map((extra, index) => {
        const isLoadingAction = loadingDelete.has(extra.id)
        return (
          <AnimatedCard key={extra.id} delay={0.1 * index} className="shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-[#a37e63]/10 rounded-full flex items-center justify-center">
                  <Star size={16} className="text-[#a37e63]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#7a5b4c] text-sm">{extra.nombre}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-[#7a5b4c]/60" />
                      <span className="text-xs text-[#7a5b4c]/70">{extra.duracionMinutos} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign size={12} className="text-green-600" />
                      <span className="text-xs font-semibold text-green-700">${extra.precio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MotionWrapper
            >
              <button
                onClick={() => onDelete(extra.id)}
                disabled={isLoadingAction}
                className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Eliminar Extra</span>
                  </>
                )}
              </button>
            </MotionWrapper>
          </AnimatedCard>
        )
      })}
    </MotionWrapper>
  )
}

export default ExtrasCards
