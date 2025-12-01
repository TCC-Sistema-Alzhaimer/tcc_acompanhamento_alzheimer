import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { verifyUserReset } from "~/services/auth";
import Button from "~/components/Button";
import { ArrowLeft } from "lucide-react";
import Input from "~/components/Input";

const verifySchema = z.object({
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(11, "CPF inválido"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setServerError("");
    try {
      const response = await verifyUserReset(data as any);
      const userId = response.data;

      navigate(ROUTES.RESET_PASSWORD, { state: { userId } });
    } catch (err) {
      console.error(err);
      setServerError("Dados não conferem. Verifique as informações.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center text-gray-700 hover:text-teal-600 transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" /> Voltar ao Login
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Recuperar Senha
        </h1>
        <p className="text-gray-700 mb-6 text-sm">
          Para sua segurança, confirme seus dados pessoais.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <Input
              placeholder="seu@email.com"
              value={form.watch("email")}
              onChange={(e) => form.setValue("email", e.target.value)}
            >
              Email
            </Input>
            {form.formState.errors.email && (
              <span className="text-red-500 text-xs">
                {form.formState.errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              placeholder="Digite o CPF"
              value={form.watch("cpf")}
              onChange={(e) => form.setValue("cpf", e.target.value)}
              mask="000.000.000-00"
            >
              CPF
            </Input>
            {form.formState.errors.cpf && (
              <span className="text-red-500 text-xs">
                {form.formState.errors.cpf.message}
              </span>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Verificando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
