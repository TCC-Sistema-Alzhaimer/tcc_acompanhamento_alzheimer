import { Patient } from "@/types/domain/patient";
import * as SecureStorage from "expo-secure-store";
import { createContext, useContext, useEffect, useReducer } from "react";

type State = {
  patientId: string | null;
  cachedPatient?: Patient | null;
  hydrated: boolean;
};

const initialState: State = {
  patientId: null,
  cachedPatient: null,
  hydrated: false,
};

const STORAGE_KEY = "@selected_patient_id";

type Action =
  | { type: "SET_ID"; patientId: string | null }
  | { type: "SET_CACHE"; patient: Patient | null }
  | { type: "HYDRATED" };

const SelectedPatientContext = createContext<{
  state: State;
  selectPatient: (patient: Patient) => Promise<void>;
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

export const SelectedPatientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const id = await SecureStorage.getItem(STORAGE_KEY);
        if (id) dispatch({ type: "SET_ID", patientId: id });
      } catch (e) {
        console.warn("Failed to load selected patient id", e);
      } finally {
        dispatch({ type: "HYDRATED" });
      }
    })();
  }, []);

  const selectPatient = async (patient: Patient) => {
    try {
      await SecureStorage.setItemAsync(STORAGE_KEY, String(patient.id));
      dispatch({ type: "SET_ID", patientId: String(patient.id) });
      dispatch({ type: "SET_CACHE", patient });
    } catch (e) {
      console.error("Failed to save patient id", e);
    }
  };

  const clearSelection = async () => {
    try {
      await SecureStorage.deleteItemAsync(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove selected patient id", e);
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
