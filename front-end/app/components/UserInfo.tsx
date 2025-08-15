import { userTypes } from "~/mocks/mock";
import type { Caregiver, Doctor, Patient } from "~/types/Users";

interface UserInfoProps {
  user: Patient | Caregiver | Doctor;
}

function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="flex flex-col w-full gap-2 bg-white p-4 rounded-lg text-black border border-gray-100">
      <h2 className="font-bold text-lg text-dark-100">
        Dados do usuário: {user.name}
      </h2>
      <div className="flex flex-col gap-1 p-4 rounded-lg bg-gray-200 text-black">
        <p className="text-dark-100 text-lg">
          <strong>
            {user.name} •{" "}
            {
              userTypes.find((type) => user.user_type_id === type.id)
                ?.description
            }
          </strong>
        </p>
        <div className="flex flex-row gap-1 text-gray-900">
          {"birthdate" in user && (
            <span>{new Date(user.birthdate).toLocaleDateString("pt-BR")}</span>
          )}{" "}
          •<span>ID: #{user.id}</span>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
