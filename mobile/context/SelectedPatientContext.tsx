import { Patient } from "@/types/domain/patient";
import * as SecureStorage from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Platform } from "react-native";

type State = {
  patientId: string | null;
  cachedPatient?: Partial<Patient> | null;
  hydrated: boolean;
};

const initialState: State = {
  patientId: null,
  cachedPatient: null,
  hydrated: false,
};

const STORAGE_KEY = "selected_patient_id";
const CACHE_KEY = "selected_patient_cache";

type Action =
  | { type: "SET_ID"; patientId: string | null }
  | { type: "SET_CACHE"; patient: Partial<Patient> | null }
  | { type: "HYDRATED" };

const SelectedPatientContext = createContext<{
  state: State;
  selectPatient: (patient: Partial<Patient>) => Promise<void>;
  clearSelection: () => Promise<void>;
  loading: boolean;
}>({
  state: initialState,
  selectPatient: async () => {},
  clearSelection: async () => {},
  loading: true,
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ID":
      return { ...state, patientId: action.patientId };
    case "SET_CACHE":
      return { ...state, cachedPatient: action.patient };
    case "HYDRATED":
      return { ...state, hydrated: true };
    default:
      return state;
  }
}

/**
 * Lê o ID do paciente armazenado localmente
 */
async function readStoredPatientId(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(STORAGE_KEY);
    }
    return await SecureStorage.getItemAsync(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to read selected patient id", error);
    return null;
  }
}

/**
 * Lê o cache do paciente armazenado localmente
 */
async function readStoredPatientCache(): Promise<Partial<Patient> | null> {
  try {
    let value: string | null;

    if (Platform.OS === "web") {
      if (typeof window === "undefined") return null;
      value = window.localStorage.getItem(CACHE_KEY);
    } else {
      value = await SecureStorage.getItemAsync(CACHE_KEY);
    }

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn("Failed to read patient cache", error);
    return null;
  }
}

/**
 * Persiste apenas o ID do paciente
 */
async function persistPatientId(id: string | null): Promise<void> {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") return;
    if (id) {
      window.localStorage.setItem(STORAGE_KEY, id);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return;
  }

  if (id) {
    await SecureStorage.setItemAsync(STORAGE_KEY, id);
  } else {
    await SecureStorage.deleteItemAsync(STORAGE_KEY);
  }
}

/**
 * Persiste o cache do paciente
 */
async function persistPatientCache(
  patient: Partial<Patient> | null
): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof window === "undefined") return;
      if (patient) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(patient));
      } else {
        window.localStorage.removeItem(CACHE_KEY);
      }
      return;
    }

    if (patient) {
      await SecureStorage.setItemAsync(CACHE_KEY, JSON.stringify(patient));
    } else {
      await SecureStorage.deleteItemAsync(CACHE_KEY);
    }
  } catch (error) {
    console.warn("Failed to persist patient cache", error);
  }
}

export const SelectedPatientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const id = await readStoredPatientId();
      const cache = await readStoredPatientCache();

      if (id) dispatch({ type: "SET_ID", patientId: id });
      if (cache) dispatch({ type: "SET_CACHE", patient: cache });

      dispatch({ type: "HYDRATED" });
      setLoading(false);
    })();
  }, []);

  /**
   * Define e persiste o paciente selecionado
   */
  const selectPatient = async (patient: Partial<Patient>) => {
    try {
      if (patient.id) {
        const id = String(patient.id);
        await persistPatientId(id);
        await persistPatientCache(patient);
        dispatch({ type: "SET_ID", patientId: id });
        dispatch({ type: "SET_CACHE", patient });
      } else {
        await persistPatientId(null);
        await persistPatientCache(null);
        dispatch({ type: "SET_ID", patientId: null });
        dispatch({ type: "SET_CACHE", patient: null });
      }
    } catch (error) {
      console.error("Failed to save patient id/cache", error);
    }
  };

  /**
   * Remove paciente selecionado e limpa armazenamento
   */
  const clearSelection = async () => {
    try {
      await persistPatientId(null);
      await persistPatientCache(null);
    } catch (error) {
      console.warn("Failed to remove selected patient", error);
    } finally {
      dispatch({ type: "SET_ID", patientId: null });
      dispatch({ type: "SET_CACHE", patient: null });
    }
  };

  return (
    <SelectedPatientContext.Provider
      value={{ state, selectPatient, clearSelection, loading }}
    >
      {children}
    </SelectedPatientContext.Provider>
  );
};

export const useSelectedPatient = () => useContext(SelectedPatientContext);
