import { createModel } from "@rematch/core";
import { RootModel } from ".";

export interface DoctorPageState {
  name: string;
  isAdditional: boolean;
  step: string;
  cabinet: string;
}

function createEmptyDoctorPageState() {
  return {
    step: "helloDoctor",
    name: "",
    isAdditional: false,
    cabinet: "",
  } as DoctorPageState;
}

const DEFAULT_STATE = createEmptyDoctorPageState();

export const doctorPage = createModel<RootModel>()({
  state: DEFAULT_STATE,
  reducers: {
    startDoctor(state) {
      return { ...state, step: "chooseDoctor" };
    },

    prevStep(state) {
      let step: string;
      if (state.step == "chooseDoctor") {
        step = "helloDoctor";
      } else {
        step = "chooseDoctor";
      }
      return { ...state, step };
    },

    setDoctor(state, payload) {
      const { name, isAdditional } = payload;
      return { ...state, step: "chooseCabinet", name, isAdditional };
    },

    setCabinet(state, payload) {
      const { cabinet } = payload;
      return { ...state, cabinet };
    },

    reload(state) {
      return createEmptyDoctorPageState();
    },
  },
  effects: (dispatch) => ({}),
});
