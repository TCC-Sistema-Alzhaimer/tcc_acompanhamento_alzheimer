import React, { useState, useCallback } from "react";
import clsx from "clsx";
import { UserListItem } from "~/components/UserList/UserListItem";
import { UserSearch } from "~/components/UserList/UserSearch";
import { Button } from "~/components/ui/button";
import { useCaregiverPatientList } from "./hooks/useCaregiverPatientList";
import type { BasicListModel } from "~/types/roles/models";

interface CaregiverPatientListProps {
  caregiverId: number;
  onSelectPatient: (id: number) => void;
  initialSearchTerm?: string;
}

export function CaregiverPatientList({
  caregiverId,
  onSelectPatient,
  initialSearchTerm = "",
}: CaregiverPatientListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const { patients, isLoading, refetch } = useCaregiverPatientList({
    caregiverId,
    query: searchTerm,
  });

  const handleSelect = (id: number | undefined) => {
    if (!id) return;
    setSelectedId(id);
    onSelectPatient(id);
  };

  const renderContent = () => {
    if (isLoading) return <PatientListSkeleton />;

    if (patients.length === 0)
      return (
        <PatientListState
          title="Nenhum paciente encontrado"
          description="Tente ajustar a busca ou atualizar."
          actionLabel="Atualizar"
          onAction={refetch}
        />
      );

    return patients.map((p) => (
      <UserListItem
        key={p.id}
        user={p}
        selected={selectedId === p.id}
        onClick={() => handleSelect(p.id)}
      />
    ));
  };

  return (
    <aside className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-4 py-3">
        <UserSearch
          onSearch={handleSearch}
          placeholder="Buscar paciente..."
          initialValue={initialSearchTerm}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className={clsx("flex flex-col", patients.length ? "gap-2" : "")}>
          {renderContent()}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Button onClick={refetch} variant="outline" className="w-full">
          Atualizar Lista
        </Button>
      </div>
    </aside>
  );
}

/* ---------------------------- UI STATES ---------------------------- */

interface PatientListStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function PatientListState({
  title,
  description,
  actionLabel,
  onAction,
}: PatientListStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border px-4 py-6 rounded-lg bg-gray-50">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

function PatientListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="rounded-lg border bg-white p-4 animate-pulse"
        >
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="mt-3 h-3 w-full bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}
