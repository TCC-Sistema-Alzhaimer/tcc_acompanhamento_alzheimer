import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "~/routes/EnumRoutes";
import { resetPassword } from "~/services/auth";
import Button from "~/components/Button";

const resetSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate(ROUTES.LOGIN);
    }
  }, [userId, navigate]);

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setServerError("");
    try {
      await resetPassword({
        userId: Number(userId),
        newPassword: data.password,
      });
      setSuccess(true);

      setTimeout(() => navigate(ROUTES.LOGIN), 3000);
    } catch (err) {
      console.error(err);
      setServerError("Erro ao salvar nova senha. Tente novamente.");
    }
  };

  if (!userId) return null;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Senha Alterada!
          </h2>
          <p className="text-gray-500">Sua senha foi redefinida com sucesso.</p>
          <p className="text-gray-400 text-sm mt-4">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  // Tela de Formulário
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Nova Senha</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Crie uma nova senha segura para sua conta.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Nova Senha
            </label>
            <input
              {...form.register("password")}
              type="password"
              placeholder="******"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
            {form.formState.errors.password && (
              <span className="text-red-500 text-xs">
                {form.formState.errors.password.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Confirmar Senha
            </label>
            <input
              {...form.register("confirmPassword")}
              type="password"
              placeholder="******"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
            />
            {form.formState.errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {form.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {serverError}
            </div>
          )}

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : "Alterar Senha"}
          </Button>
        </form>
      </div>
    </div>
  );
}
