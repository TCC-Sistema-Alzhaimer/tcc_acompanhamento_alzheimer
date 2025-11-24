import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, UserPlus2, X } from "lucide-react";
import clsx from "clsx";

import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import type { ChatResponse } from "~/types/api/chat/ChatResponse";
import type { BasicListModel } from "~/types/roles/models";
import { createChat } from "~/services/chatService";
import { searchUsersForChat } from "~/services/userService";

const MAX_PARTICIPANTS = 50;
const MIN_SEARCH_LENGTH = 3;
const ROLE_LABELS: Record<string, string> = {
  PATIENT: "Paciente",
  CAREGIVER: "Cuidador",
  DOCTOR: "Médico",
  ADMINISTRATOR: "Administrador",
};

const createChatSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Informe um nome com pelo menos 3 caracteres")
    .max(120, "O nome pode ter no máximo 120 caracteres"),
  participantIds: z
    .array(z.number())
    .min(1, "Selecione pelo menos um participante")
    .max(
      MAX_PARTICIPANTS,
      `Um chat pode ter no máximo ${MAX_PARTICIPANTS} participantes`
    ),
});

export type CreateChatFormValues = z.infer<typeof createChatSchema>;

export type CreateChatFormProps = {
  isOpen: boolean;
  onCancel: () => void;
  onCreated: (chat: ChatResponse) => Promise<void> | void;
  currentUser: BasicListModel;
};

export function CreateChatForm({
  isOpen,
  onCancel,
  onCreated,
  currentUser,
}: CreateChatFormProps) {
  const form = useForm<CreateChatFormValues>({
    resolver: zodResolver(createChatSchema),
    defaultValues: {
      name: "",
      participantIds: currentUser?.id ? [currentUser.id] : [],
    },
  });
  const [selectedParticipants, setSelectedParticipants] = useState<
    BasicListModel[]
  >(currentUser?.id ? [currentUser] : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BasicListModel[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const syncParticipants = useCallback(
    (entries: BasicListModel[]) => {
      setSelectedParticipants(entries);
      const ids = entries
        .map((entry) => entry.id)
        .filter((id): id is number => typeof id === "number");
      form.setValue("participantIds", ids, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (ids.length) {
        form.clearErrors("participantIds");
      }
    },
    [form]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmed = searchTerm.trim();

    if (trimmed.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearchingUsers(false);
      return;
    }

    let isCancelled = false;
    setIsSearchingUsers(true);
    setSearchError(null);

    const timeoutId = setTimeout(() => {
      searchUsersForChat(trimmed)
        .then(({ data }) => {
          if (isCancelled) {
            return;
          }
          setSearchResults(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          if (isCancelled) {
            return;
          }
          const backendMessage = (
            error as { response?: { data?: { message?: string } } }
          )?.response?.data?.message;
          setSearchResults([]);
          setSearchError(
            backendMessage ?? "Não foi possível buscar usuários agora."
          );
        })
        .finally(() => {
          if (isCancelled) {
            return;
          }
          setIsSearchingUsers(false);
        });
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isOpen, searchTerm]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    form.reset({
      name: "",
      participantIds: currentUser?.id ? [currentUser.id] : [],
    });
    setSelectedParticipants(currentUser?.id ? [currentUser] : []);
    setSearchTerm("");
    setSearchResults([]);
    setFormError(null);
  }, [form, isOpen, currentUser]);

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    const hasCurrentUser = selectedParticipants.some(
      (participant) => participant.id === currentUser.id
    );

    if (!hasCurrentUser) {
      syncParticipants([currentUser, ...selectedParticipants]);
    }
  }, [currentUser, selectedParticipants, syncParticipants]);

  const handleAddParticipant = (user: BasicListModel) => {
    if (
      !user.id ||
      selectedParticipants.some((participant) => participant.id === user.id)
    ) {
      return;
    }

    if (selectedParticipants.length >= MAX_PARTICIPANTS) {
      form.setError("participantIds", {
        type: "manual",
        message: `Limite de ${MAX_PARTICIPANTS} participantes atingido`,
      });
      return;
    }

    syncParticipants([...selectedParticipants, user]);
  };

  const handleRemoveParticipant = (id?: number) => {
    if (typeof id !== "number" || id === currentUser?.id) {
      return;
    }

    const updated = selectedParticipants.filter(
      (participant) => participant.id !== id
    );
    syncParticipants(updated);
  };

  const showingSearchResults = searchTerm.trim().length >= MIN_SEARCH_LENGTH;
  const listIsLoading = showingSearchResults && isSearchingUsers;
  const participantsPool = showingSearchResults ? searchResults : [];

  const onSubmit = async (values: CreateChatFormValues) => {
    setFormError(null);
    try {
      const { data } = await createChat(values);
      await onCreated(data);
      form.reset({
        name: "",
        participantIds: currentUser?.id ? [currentUser.id] : [],
      });
      setSelectedParticipants(currentUser?.id ? [currentUser] : []);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Erro ao criar chat", error);
      setFormError("Não foi possível criar o chat agora. Tente novamente.");
    }
  };

  const participantPill = useMemo(() => {
    if (!selectedParticipants.length) {
      return (
        <p className="text-sm text-gray-700">
          Nenhum participante selecionado até o momento.
        </p>
      );
    }

    return (
      <div className="flex flex-wrap gap-2">
        {selectedParticipants.map((participant, index) => {
          const isCurrentUser = participant.id === currentUser?.id;
          return (
            <button
              key={`${participant.id}-${index}`}
              type="button"
              onClick={() =>
                !isCurrentUser && handleRemoveParticipant(participant.id)
              }
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-200",
                isCurrentUser
                  ? "cursor-not-allowed opacity-80"
                  : "hover:bg-gray-50"
              )}
              title={participant.email}
              disabled={isCurrentUser}
            >
              <span className="truncate max-w-[160px]">{participant.name}</span>
              {!isCurrentUser && <X className="size-3.5" />}
              {isCurrentUser && (
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Você
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }, [currentUser?.id, selectedParticipants]);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do chat</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex.: Acompanhamento Maria Silva"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participantIds"
          render={() => (
            <FormItem>
              <FormLabel>Participantes</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/80 p-3">
                    {participantPill}
                  </div>

                  <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium uppercase tracking-wide text-gray-700">
                        Buscar usuários
                      </label>
                      <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={`Digite ao menos ${MIN_SEARCH_LENGTH} caracteres (nome, e-mail...)`}
                        autoComplete="off"
                      />
                    </div>
                    {showingSearchResults ? (
                      <p className="text-xs text-gray-600">
                        Resultados para "{searchTerm.trim()}". Clique para
                        adicionar ao chat.
                      </p>
                    ) : (
                      <p className="text-xs text-gray-600">
                        Digite pelo menos {MIN_SEARCH_LENGTH} caracteres para
                        buscar participantes.
                      </p>
                    )}

                    <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                      {listIsLoading ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="size-4 animate-spin" />
                          Carregando usuários...
                        </div>
                      ) : participantsPool.length ? (
                        participantsPool.map((participant) => {
                          const isSelected = selectedParticipants.some(
                            (current) => current.id === participant.id
                          );

                          return (
                            <button
                              key={`${showingSearchResults ? "search" : "suggestion"}-${participant.id}`}
                              type="button"
                              onClick={() => handleAddParticipant(participant)}
                              disabled={isSelected || !participant.id}
                              className={clsx(
                                "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition",
                                isSelected
                                  ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                                  : "border-gray-200 hover:border-emerald-500 hover:bg-gray-50"
                              )}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {participant.name}
                                </p>
                                <p className="truncate text-xs text-gray-600">
                                  {participant.email}
                                </p>
                              </div>
                              {isSelected ? (
                                <Check className="size-4 text-emerald-700" />
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                                  <UserPlus2 className="size-3.5" />
                                  {ROLE_LABELS[participant.userType] ??
                                    "Usuário"}
                                </span>
                              )}
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-700">
                          {showingSearchResults
                            ? (searchError ??
                              "Nenhum usuário encontrado para este termo.")
                            : `Digite pelo menos ${MIN_SEARCH_LENGTH} caracteres para buscar usuários.`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="action"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Criar chat
          </Button>
        </div>
      </form>
    </Form>
  );
}
