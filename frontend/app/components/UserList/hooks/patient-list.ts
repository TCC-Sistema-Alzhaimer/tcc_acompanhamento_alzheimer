import { useEffect, useState } from "react";
import type { BasicListModel } from "~/types/roles/models";
import { SystemRoles } from "~/types/SystemRoles";
import { patientList } from "../mock/patient-list";

export function usePatientList({
  doctorId,
  query,
}: {
  doctorId: number;
  query: string;
}) {
  const [patients, setPatients] = useState<BasicListModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // TODO: Implementar a lógica de busca de pacientes com o backend
    // ? aparentemente é esta função que busca os pacientes do doctor: frontend\app\services\doctorService.ts
    const timer = setTimeout(() => {
      const calculateAge = (birthdate: Date) => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
          age--;
        }
        return age;
      };

      setPatients(
        patientList
          .filter((patient) =>
            patient.name.toLowerCase().includes(query.toLowerCase())
          )
          .map((patient) => ({
            id: patient.id,
            name: patient.name,
            phone: patient.phone,
            email: patient.email,
            userType: SystemRoles.PATIENT,
            age: calculateAge(patient.dateOfBirth),
          }))
      );
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [doctorId, query]);

  return { patients, isLoading };
}
