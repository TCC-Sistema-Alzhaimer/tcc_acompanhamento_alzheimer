import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "~/components/Button";
import Form from "~/components/Form";
import { ROUTES } from "~/routes/EnumRoutes";
import { patients, doctors } from "~/mocks/mock";
import type { Patient } from "~/types/Users";
import { useAuth } from "~/hooks/useAuth";

function LoginPage() {

    const navigate = useNavigate();

    const {login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if(username !== "" && password !== "") {
           await login(username, password).then(() => {
                const user = patients.find((p: Patient) => p.email === username);
                if (user) {
                    navigate(ROUTES.HOME);
                } else {
                    const doctor = doctors.find((d) => d.email === username);
                    if (doctor) {
                        navigate(ROUTES.DOCTOR.EXAMINATION);
                    }
                }
            }
            ).catch((error) => {
                alert(error.message);
                setUsername("");
                setPassword("");
            });
        }
        else {
            alert("Usuário ou senha inválidos");
            setUsername("");
            setPassword("");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-3 w-1/4 rounded-2xl shadow-2xl bg-white">

            <Form.Header title={"Login"} />
            <Form.Input 
                name="username" 
                label="Usuário:" 
                type="email"  
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Email " 
            />
            <Form.Input 
                name="password" 
                label="Senha:" 
                type="password" 
                onChange={(e) => setPassword(e.target.value)}  
                placeholder="Senha"
            />
            <a href="/forgot-password" className="text-blue-500 hover:underline mb-4 self-end">Esqueceu sua senha?</a>
            <Button type="submit" onClick={handleSubmit} className="w-full cursor-pointer">Entrar</Button>

        </div>
    );
}

export default LoginPage;