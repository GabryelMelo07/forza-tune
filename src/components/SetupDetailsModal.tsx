"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SetupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setupData?: any;
  isCalculationResult?: boolean;
}

export function SetupDetailsModal({
  isOpen,
  onClose,
  setupData,
  isCalculationResult = false,
}: SetupDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCalculationResult
              ? "Resultados do Cálculo"
              : "Detalhes do Setup"}
          </DialogTitle>
          <DialogDescription>
            {isCalculationResult
              ? "Ajuste seu setup com os valores abaixo"
              : "Valores de tunagem do setup salvo"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {setupData && (
            <>
              <p>
                ↩️ Rigidez de Retorno Frontal:{" "}
                {setupData.frontReturnStiffness?.toFixed(2)}
              </p>
              <p>
                ↩️ Rigidez de Retorno Traseira:{" "}
                {setupData.rearReturnStiffness?.toFixed(2)}
              </p>
              <p>
                ⚙️ Rigidez de Compressão Frontal:{" "}
                {setupData.frontCompressionStiffness?.toFixed(2)}
              </p>
              <p>
                ⚙️ Rigidez de Compressão Traseira:{" "}
                {setupData.rearCompressionStiffness?.toFixed(2)}
              </p>
              <p>
                🏁 Barra Estabilizadora Frontal:{" "}
                {setupData.frontARB?.toFixed(2)}
              </p>
              <p>
                🏁 Barra Estabilizadora Traseira:{" "}
                {setupData.rearARB?.toFixed(2)}
              </p>
              <p>🔧 Molas Dianteiras: {setupData.frontSprings?.toFixed(2)}</p>
              <p>🔧 Molas Traseiras: {setupData.rearSprings?.toFixed(2)}</p>
            </>
          )}
        </div>
        <Button onClick={onClose}>Fechar</Button>
      </DialogContent>
    </Dialog>
  );
}
