import React from "react";
import { useSocket } from "./Socket";
import { socket } from "../examples/socket";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";

export function WSComponent(props: WSComponentProps) {
  const { socket, isConnected, socketStatus } = useSocket();

  React.useEffect(() => {
    console.log(socket, "socket");
    if (!socket) {
      return;
    }
    const setPatinet = (data: any) => {
      props.setPatientController(data);
      props.setPatientScreen(data);
    };

    const nextDoctorForPatient = (data: any) => {
      props.setNextDoctorForPatient(data);
    };

    const screenBreak = () => {
      props.setScreenBreak();
    };

    const finishBreak = () => {
      props.finishScreenBreak();
    };

    const controllerLeave = () => {
      props.setScreenUnActive();
    };

    const controllerConnect = (data: any) => {
      props.setScreenDoctor(data);
    };

    const screenConnect = () => {
      socket.emit("aboutController");
    };

    const controllerInfo = (data: any) => {
      const { doctor, patient } = data;
      props.setScreenDoctor(doctor);
      props.setPatientScreen(patient);
    };

    socket.on("newPatient", setPatinet);

    socket.on("nextDoctorForPatient", nextDoctorForPatient);

    socket.on("setBreak", screenBreak);

    socket.on("finishBreak", finishBreak);

    socket.on("controllerLeave", controllerLeave);

    socket.on("controllerConnect", controllerConnect);

    socket.on("controllerInfo", controllerInfo);

    // socket.on("screenConnect", screenConnect);
    
  }, [socket]);

  return null;
}

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  setPatientController: dispatch.controllerPage.setPatient,
  setPatientScreen: dispatch.screenPage.setPatient,
  setNextDoctorForPatient: dispatch.controllerPage.setPatientFinishDoctor,
  setScreenIsActive: dispatch.screenPage.setActive,
  setScreenUnActive: dispatch.screenPage.setUnActive,
  setScreenBreak: dispatch.screenPage.setBreak,
  finishScreenBreak: dispatch.screenPage.finishBreak,
  setScreenDoctor: dispatch.screenPage.setDoctor,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type WSComponentProps = StateProps & DispatchProps;

export const WS = connect(mapState, mapDispatch)(WSComponent);
