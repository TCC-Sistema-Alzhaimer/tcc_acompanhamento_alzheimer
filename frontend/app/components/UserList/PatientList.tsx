import React, { useState, useCallback } from "react";
import clsx from "clsx";
import { Loader2, RefreshCcw } from "lucide-react";
import { UserListItem } from "../UserList/UserListItem";
import { UserSearch } from "../UserList/UserSearch";
import { usePatientList } from "./hooks/patient-list";
import { Button } from "~/components/ui/button";
import ButtonLegacy from "~/components/Button";

interface PatientListProps {
  doctorId: number;
  onSelectPatient: (id: number) => void;
  onCreatePatient: () => void;
  initialSearchTerm?: string;
}

export function PatientList({
  doctorId,
  onSelectPatient,
  onCreatePatient,
  initialSearchTerm = "",
}: PatientListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const { patients, isLoading, refetch } = usePatientList({
    doctorId,
    query: searchTerm,
  });

  const renderContent = () => {
    if (isLoading) {
      return <PatientListSkeleton />;
    }

    if (patients.length === 0) {
      return (
        <PatientListState
          title="Nenhum paciente encontrado"
          description="Tente ajustar a busca ou atualize a lista."
          actionLabel="Atualizar"
          onAction={refetch}
        />
      );
    }

    return patients.map((p) => (
      <UserListItem
        key={p.id}
        user={p}
        selected={selectedId === p.id}
        onClick={() => {
          if (!p.id) return;
          setSelectedId(p.id);
          onSelectPatient(p.id);
        }}
      />
    ));
  };

  return (
    <aside className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3 flex-shrink-0">
        <UserSearch
          onSearch={handleSearch}
          placeholder="Buscar por nome..."
          initialValue={initialSearchTerm}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div
          className={clsx(
            "flex flex-col",
            patients.length > 0 ? "gap-2" : "gap-0"
          )}
        >
          {renderContent()}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <ButtonLegacy onClick={onCreatePatient} variant="dashed">
          Gerenciar pacientes
        </ButtonLegacy>
      </div>
    </aside>
  );
}

function PatientListState({
  title,
  description,
  actionLabel,
  onAction,
  tone = "default",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-6 text-center",
        tone === "error"
          ? "border-red-200 bg-red-50/40 text-red-600"
          : "border-gray-200 bg-gray-50 text-gray-600"
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-current/80">{description}</p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant={tone === "error" ? "destructive" : "outline"}
          onClick={onAction}
          className="mt-1"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function PatientListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={`patient-skeleton-${index}`}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}
