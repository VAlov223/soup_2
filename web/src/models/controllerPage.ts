import { createModel } from "@rematch/core";
import { RootModel } from ".";

export interface Patient {
  id: string;
  isGold: boolean;
  doctors: string[];
  returnTo: string[];
}

export interface ControllerPageState {
  patient: Patient | null ;
  nextDoctors: string[];
  step: string;
  patientFinishDoctor: string | null;
  isAdditional: boolean;
  queue: string;
}

function createEmptyControllerPageState() {
  return {
    patient: null,
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
        return { ...state, step: "finishPatient" };
      }

      if (state.step == "finishPatient") {
        return { ...state, step: "getPatient" };
      }

      let nextStep = steps.indexOf(state.step);

      return { ...state, step: steps[nextStep + 1] };
    },

    setBreak(state) {
      return { ...state, step: "break" };
    },

    setPatientFinishDoctor(state, payload) { 
      return {...state, patientFinishDoctor: payload}
    }, 

    setPatient(state, payload) {
      if ("id" in payload) {
        return { ...state, patient: payload };
      }
      return { ...state };
    },

    setAdditional(state, payload) {
      return { ...state, isAdditional: payload };
    },

    finishBreak(state) {
      return { ...state, step: "getPatient" };
    },

    setQueue(state, payload) { 
      return {...state, queue: payload}
    }, 

    addNextDoctor(state, payload) {
      console.log(state.nextDoctors)
      if (!state.nextDoctors.includes(payload)) {
        return { ...state, nextDoctors: [...state.nextDoctors, payload] };
      }
    },

    reload(state) {
      return createEmptyControllerPageState();
    },
  },
  effects: (dispatch) => ({}),
});
