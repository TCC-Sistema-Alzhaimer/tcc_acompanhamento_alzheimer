import { Patient } from "@/types/domain/patient";
import * as SecureStorage from "expo-secure-store";
import { createContext, useContext, useEffect, useReducer } from "react";
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

type Action =
  | { type: "SET_ID"; patientId: string | null }
  | { type: "SET_CACHE"; patient: Partial<Patient> | null }
  | { type: "HYDRATED" };

const SelectedPatientContext = createContext<{
  state: State;
  selectPatient: (patient: Partial<Patient>) => Promise<void>;
  clearSelection: () => Promise<void>;
}>({
  state: initialState,
  selectPatient: async () => {},
  clearSelection: async () => {},
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

export const SelectedPatientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const id = await readStoredPatientId();
      if (id) {
        dispatch({ type: "SET_ID", patientId: id });
      }
      dispatch({ type: "HYDRATED" });
    })();
  }, []);

  const selectPatient = async (patient: Partial<Patient>) => {
    try {
      if (patient.id) {
        const id = String(patient.id);
        await persistPatientId(id);
        dispatch({ type: "SET_ID", patientId: id });
      } else {
        await persistPatientId(null);
        dispatch({ type: "SET_ID", patientId: null });
      }
      dispatch({ type: "SET_CACHE", patient });
    } catch (error) {
      console.error("Failed to save patient id", error);
    }
  };

  const clearSelection = async () => {
    try {
      await persistPatientId(null);
    } catch (error) {
      console.warn("Failed to remove selected patient id", error);
    } finally {
      dispatch({ type: "SET_ID", patientId: null });
      dispatch({ type: "SET_CACHE", patient: null });
    }
  };

  return (
    <SelectedPatientContext.Provider
      value={{ state, selectPatient, clearSelection }}
    >
      {children}
    </SelectedPatientContext.Provider>
  );
};

export const useSelectedPatient = () => useContext(SelectedPatientContext);
