import { createModel } from "@rematch/core";
import { RootModel } from ".";

import { RootState, Dispatch } from "../store";

export interface ScreenPageState {
  doctor: string;
  patient: string;
  isBreak: boolean;
  isActive: boolean
}

function createEmptyScreenPageState() {
  return {
    doctor: "",
    patient: "",
    isBreak: false,
    isActive: false,
  } as ScreenPageState;
}

const DEFAULT_STATE = createEmptyScreenPageState();

export const screenPage = createModel<RootModel>()({
  state: DEFAULT_STATE,
  reducers: {
    setDoctor(state, payload) {
      return { ...state, doctor: payload, isActive: true };
    },

    setBreak(state) {
      return { ...state, isBreak: true };
    },

    finishBreak(state) {
      return { ...state, isBreak: false };
    },

    setPatient(state, payload) {
      return { ...state, patient: payload };
    },

    setUnActive(state) { 
      return createEmptyScreenPageState()
    }, 

    setActive(state) { 
      return {...state, isActive: true}
    }
  },

  effects: (dispatch) => ({}),
});
