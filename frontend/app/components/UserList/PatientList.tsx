import { useEffect, useState } from "react";
import type { BasicListModel } from "~/types/roles/models";
import { UserListItem } from "../UserList/UserListItem";
import { UserSearch } from "../UserList/UserSearch";
import { getPatientsByDoctor } from "~/services/doctorService";

interface PatientListProps {
    doctorId: number;
    onSelectPatient: (id: number) => void;
    onCreatePatient: () => void;
}

export function PatientList({ doctorId, onSelectPatient, onCreatePatient }: PatientListProps) {
    const [patients, setPatients] = useState<BasicListModel[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const fetchPatients = (query?: string) => {
        getPatientsByDoctor(doctorId, query)
            .then(res => setPatients(res.data))
            .catch(err => console.error("Erro ao buscar pacientes:", err));
    };

    useEffect(() => {
        if (!doctorId) return;
        fetchPatients();
    }, [doctorId]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        fetchPatients(term);
    };

    return (
        <div className="w-1/4 border-r flex flex-col h-full">
            <div className="flex flex-col">
                <UserSearch onSearch={handleSearch} />
                <button
                    onClick={onCreatePatient}
                    className="m-3 p-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                    Novo Paciente
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {patients.map(p => (
                    <UserListItem
                        key={p.id}
                        user={p}
                        selected={selectedId === p.id}
                        onClick={() => {
                            if (!p.id) return; // evita undefined
                            setSelectedId(p.id);
                            onSelectPatient(p.id);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
