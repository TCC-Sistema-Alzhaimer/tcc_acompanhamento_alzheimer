import React from "react";
import { Button } from "~/components/ui/button";

interface Props {
  patientId: number | null;
  onViewExams: () => void;
}

export function CaregiverQuickActions({ patientId, onViewExams }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Ações rápidas</h2>

      <Button
        disabled={!patientId}
        onClick={onViewExams}
        className="w-full"
      >
        Ver exames do paciente
      </Button>
    </div>
  );
}
