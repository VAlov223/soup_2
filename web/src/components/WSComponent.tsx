import React from "react";
import { useSocket } from "./Socket";
import { socket } from "../examples/socket";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";

function WSComponent(props: WSComponentProps) {
  const { socket, isConnected } = useSocket();
  React.useEffect(() => {
    socket.on("newPatient", (data: any) => {});
  });
}

const mapState = (state: RootState) => ({});

const mapDispatch = (dispatch: Dispatch) => ({
  setPatientController: dispatch.controllerPage.setPatient,
  setPatientScreen: dispatch.screenPage.setPatient,
  setNextDoctorForPatient: dispatch.controllerPage.setPatientFinishDoctor,
  setScreenIsActive: dispatch.screenPage.setActive,
  setScreenBreak: dispatch.screenPage.setBreak,
  finishScreenBreak: dispatch.screenPage.finishBreak,
  setScreenDoctor: dispatch.screenPage.setDoctor,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type WSComponentProps = StateProps & DispatchProps;

export const ConnectControllerPage = connect(
  mapState,
  mapDispatch
)(WSComponent);
