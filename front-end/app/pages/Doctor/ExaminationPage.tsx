import { Search } from "@mui/icons-material";
import { useState } from "react";
import Button from "~/components/Button";
import Form from "~/components/Form";
import Input from "~/components/Input";
import List from "~/components/List";
import ListItem from "~/components/List/ListItem";
import ListRoot from "~/components/List/ListRoot";
import ListSearch from "~/components/List/ListSearch";
import UserInfo from "~/components/UserInfo";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { patients } from "~/mocks/mock";
import type { Caregiver, Doctor, Patient } from "~/types/Users";

function ExaminationPage() {
  const [users, setUsers] = useState(patients);
  const [selectedUser, setSelectedUser] = useState<
    Patient | Doctor | Caregiver
  >();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { value: "exame1", label: "Exame 1" },
    { value: "exame2", label: "Exame 2" },
    { value: "exame3", label: "Exame 3" },
  ]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSearch = (s: string) => {
    if (s.trim() === "") {
      setUsers(patients);
      return;
    }

    const filteredUsers = patients.filter((user) =>
      user.name.toLowerCase().includes(s.toLowerCase())
    );

    setUsers(filteredUsers);
  };

  const handleSelect = (id: Number) => {
    const selected = patients.find((user) => user.id === id);
    if (selected) {
      if (selectedUser && selectedUser.id === selected.id) {
        setSelectedUser(undefined);
        return;
      }
      setSelectedUser(selected);
      console.log("Selected User:", selected);
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <h1 className="text-dark-100 text-2xl font-bold">Solicitar Exames</h1>

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
            <ListSearch children={<Search />} onSearch={handleSearch} />
            <div className="flex flex-col gap-3 border border-gray-100 rounded-lg p-4 h-full">
              {users.map((patient) => (

                <List.ItemRoot active={selectedUser?.id === patient.id} key={patient.id} onClick={() => handleSelect(patient.id)}>
                    <List.ItemIcon children={<div className="w-[38px] h-[38px] bg-green-500 rounded-full shadow-md"></div>} />
                    <List.ItemContent title={patient.name} description={`ID: ${patient.id} - Nascimento: ${new Date(patient.birthdate).toLocaleDateString()}`} className="flex-1 p-1 justify-self-start" />
                    {selectedUser?.id === patient.id && (
                        <List.ItemIcon children={<ArrowForwardIcon className="text-white bg-green-500 p-1 rounded-full shadow-md" sx={{fontSize: "38px"}}/>} />
                    )}
                </List.ItemRoot>

              ))}
            </div>
          </ListRoot>
        </div>

        {selectedUser && (
          <div className="flex w-3/5 flex-col gap-2">
            <>
              <UserInfo user={selectedUser} />

              <Form.Root>
                <Form.Select
                  options={options}
                  name="tipoExame"
                  onChange={(e) => setSelectedOption(String(e.target.value))}
                  value={selectedOption}
                  label="Tipo de Exame"
                  placeholder="Selecione o tipo de exame"
                />
                <Form.Input
                  name="categoria"
                  placeholder="Categoria"
                  type="text"
                  onChange={() => {}}
                  label="Categoria"
                />
                <Form.Input
                  name="title"
                  placeholder="Título do Exame"
                  type="text"
                  onChange={() => {}}
                  label="Título do Exame"
                />
                <Form.Input
                  name="dataFinal"
                  placeholder="Data Final"
                  type="date"
                  onChange={() => {}}
                  label="Data Final"
                />
                <Form.Input
                  name="anotacoes"
                  placeholder="Anotações"
                  type="text"
                  onChange={() => {}}
                  label="Anotações"
                />
                <Button
                  type="submit"
                  children="Solicitar"
                  className="cursor-pointer w-max px-16 font-bold self-end"
                />
              </Form.Root>
            </>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExaminationPage;
