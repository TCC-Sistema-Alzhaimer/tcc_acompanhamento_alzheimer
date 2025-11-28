import { useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ROUTES } from "~/routes/EnumRoutes";
import { useAuth } from "~/hooks/useAuth";
import { LogIn, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(1, { message: "Senha é obrigatória" })
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(data.username, data.password);
      navigate(ROUTES.PRIVATE_HOME);
    } catch (error: any) {
      // Extrair mensagem de erro do axios ou usar mensagem padrão
      let message = "Erro ao fazer login. Verifique suas credenciais.";

      if (error.response?.data) {
        const responseData = error.response.data;
        if (typeof responseData === "string" && responseData.length > 0) {
          message = responseData;
        } else if (responseData.message) {
          message = responseData.message;
        } else if (responseData.error) {
          message = responseData.error;
        }
      }

      setErrorMessage(message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-md rounded-2xl shadow-2xl bg-white">
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
      </div>

      {errorMessage && (
        <div className="w-full mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700">
          <AlertCircle size={18} className="flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline text-sm block text-right"
          >
            Esqueceu sua senha?
          </Link>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={form.formState.isSubmitting}
          >
            <LogIn size={18} className="mr-2" />
            {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginPage;
