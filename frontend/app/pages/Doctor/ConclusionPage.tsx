import { AddCircle, PlusOne, Search } from "@mui/icons-material";
import { useState } from "react";
import Button from "~/components/Button";
import Form from "~/components/Form";
import Input from "~/components/Input";
import ListItem from "~/components/List/ListItem";
import ListRoot from "~/components/List/ListRoot";
import ListSearch from "~/components/List/ListSearch";
import UserInfo from "~/components/UserInfo";

import { patients, conclusions, exams } from "~/mocks/mock";
import type {
  Caregiver,
  Doctor,
  Patient,
  Exam,
  Conclusion,
} from "~/types/Users";

function ConclusionPage() {
  const [users, setUsers] = useState(patients);
  const [selectedUser, setSelectedUser] = useState<
    Patient | Doctor | Caregiver
  >();
  const [patientExams, setPatientExams] = useState<Exam[]>([]);
  const [examSelected, setExamSelected] = useState<string>("");

  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { value: "exame1", label: "Exame 1" },
    { value: "exame2", label: "Exame 2" },
    { value: "exame3", label: "Exame 3" },
  ]);

  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSearchUser = (s: string) => {
    if (s.trim() === "") {
      setUsers(patients);
      return;
    }

    const filteredUsers = patients.filter((user) =>
      user.name.toLowerCase().includes(s.toLowerCase())
    );

    setUsers(filteredUsers);
  };

  const handleSearchExam = (s: string) => {
    if (s.trim() === "") {
      setPatientExams(
        exams.filter((exam) => exam.patient_id === selectedUser?.id)
      );
      return;
    }
    const filteredExams = exams.filter(
      (exam) =>
        exam.date.toString().toLowerCase().includes(s.toLowerCase()) &&
        exam.patient_id === selectedUser?.id
    );

    setPatientExams(filteredExams);
  };

  const handleSelectPatient = (id: Number) => {
    const selected = patients.find((user) => user.id === id);
    if (selected) {
      setExamSelected("");
      if (selectedUser && selectedUser.id === selected.id) {
        setSelectedUser(undefined);
        return;
      }
      setSelectedUser(selected);
      setPatientExams(exams.filter((exam) => exam.patient_id === selected.id));
    }
  };

  const handleSelectExam = (id: Number) => {
    const selected = patientExams.find((exam) => exam.id === id);
    if (selected) {
      if (examSelected === selected.id.toString()) {
        setExamSelected("");
        return;
      }
      setExamSelected(selected.id.toString());
      console.log("Selected Exam:", selected);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <h1 className="text-dark-100 text-2xl font-bold">Gerar Conclusão</h1>

      <div
        className={`h-full flex flex-row gap-2 w-full ${
          selectedUser ? "items-start" : "items-center"
        }`}
      >
        <div
          className={`h-full flex rounded-2xl items-center bg-white ${
            selectedUser ? "w-2/5" : "w-full"
          }`}
        >
          <ListRoot>
            <ListSearch children={<Search />} onSearch={handleSearchUser} />
            <div className="flex flex-col gap-3 border border-gray-100 rounded-lg p-4 h-full">
              {users.map((patient) => (
                <ListItem
                  key={patient.id}
                  item={patient}
                  active={selectedUser?.id === patient.id}
                  onClick={handleSelectPatient}
                />
              ))}
            </div>
          </ListRoot>
        </div>

        {selectedUser &&
          (patientExams.length > 0 ? (
            !examSelected && (
              <div className="flex w-3/5 flex-col gap-2">
                {selectedUser && <UserInfo user={selectedUser} />}

                <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-2.5">
                  <ListRoot>
                    <ListSearch
                      children={<Search />}
                      onSearch={handleSearchExam}
                      placeholder="Buscar exames..."
                    />
                    {patientExams.map((exam) => {

                      return (
                        <ListItem
                          key={exam.id}
                          item={exam}
                          active={false}
                          onClick={handleSelectExam}
                        />
                      );
                    })}
                  </ListRoot>
                </div>
              </div>
            )
          ) : (
            <div className="flex w-3/5 flex-col gap-2">
              <p className="text-black text-center text-lg pt-6">
                Nenhum exame encontrado para este paciente.
              </p>
            </div>
          ))}

        {examSelected && selectedUser && (
          <div className="flex w-3/5 flex-col gap-2">
            <>
              <UserInfo user={selectedUser} />

              <Form.Root>
                <Form.Header
                  title="Conclusão Médica"
                  subtitle={`Data de registro: ${new Date().toLocaleDateString()}`}
                />
                <Form.Input
                  name="tituloExame"
                  placeholder="Título..."
                  type="text"
                  onChange={() => {}}
                  label="Título da conclusão"
                />
                <Form.Input
                  name="conclusaoMedica"
                  placeholder="Conclusão..."
                  type="text"
                  onChange={() => {}}
                  label="Conclusão Médica"
                />
                <p>Anexos:</p>
                <Button
                  type="button"
                  children={<AddCircle />}
                  className="cursor-pointer w-min"
                  onClick={() => {}}
                />
                <div className="flex flex-row justify-end gap-2">
                  <Button
                    type="button"
                    children="Cancelar"
                    className="cursor-pointer w-40 hover:bg-red-600 bg-red-500"
                    onClick={() => {}}
                  />
                  <Button
                    type="submit"
                    children="Registrar"
                    className="cursor-pointer w-40"
                  />
                </div>
              </Form.Root>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConclusionPage;
