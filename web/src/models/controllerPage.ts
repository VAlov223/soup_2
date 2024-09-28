import { createModel } from "@rematch/core";
import { RootModel } from ".";

export interface Patient {
  id: string;
  nowReturn: null | true;
  isGold: boolean;
  doctors: string[];
  returnTo: string[];
}

export interface ControllerPageState {
  patient: Patient | null;
  nextDoctors: string[];
  isReturn: boolean;
  step: string;
  patientFinishDoctor: string | null;
  isAdditional: boolean;
  queue: string;
}

function createEmptyControllerPageState() {
  return {
    patient: null,
    isReturn: true,
    step: "getPatient",
    patientFinishDoctor: null,
    nextDoctors: [],
    isAdditional: false,
    queue: "",
  } as ControllerPageState;
}

const DEFAULT_STATE = createEmptyControllerPageState();

export const controllerPage = createModel<RootModel>()({
  state: DEFAULT_STATE,
  reducers: {
    nextStep(state) {
      const steps = ["getPatient", "nextDoctors", "finishPatient"];

      if (state.isAdditional && state.step == "getPatient") {
        return {
          ...state,
          step: "finishPatient",
        };
      }

      if (state.step == "finishPatient") {
        return {
          ...state,
          step: "getPatient",
          patient: null,
          nextDoctors: [],
          patientFinishDoctor: null,
          isReturn: true,
        };
      }

      let nextStep = steps.indexOf(state.step);

      return { ...state, step: steps[nextStep + 1] };
    },

    setBreak(state) {
      return { ...state, step: "break" };
    },

    setPatientFinishDoctor(state, payload) {
      return { ...state, patientFinishDoctor: payload };
    },

    setPatient(state, payload) {
      return { ...state, patient: payload };
    },

    setAdditional(state, payload) {
      return { ...state, isAdditional: payload };
    },

    finishBreak(state) {
      return {
        ...state,
        step: "getPatient",
        patient: null,
        nextDoctors: [],
        patientFinishDoctor: null,
        isReturn: true,
      };
    },

    setQueue(state, payload) {
      return { ...state, queue: payload };
    },

    addNextDoctor(state, payload) {
      if (!state.nextDoctors.includes(payload)) {
        return { ...state, nextDoctors: [...state.nextDoctors, payload] };
      } else {
        const next = state.nextDoctors.filter((el) => el !== payload);
        return { ...state, nextDoctors: next };
      }
    },

    changeReturn(state) {
      return { ...state, isReturn: !state.isReturn };
    },

    reload(state) {
      return createEmptyControllerPageState();
    },
  },
  effects: (dispatch) => ({}),
});
