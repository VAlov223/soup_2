import React from "react";
import { useSocket } from "../Socket";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { Patient } from "../../models/controllerPage";

interface ControllerProps {
  cabinet: string;
  doctor: string;
}

export function Controller(props: ControllerPageStateProps) {
  const {
    cabinet,
    doctor,
    setPatient,
    setPatientFinishDoctor,
    step,
    patient,
    isAdditional,
    queue,
  } = props;
  const { socket, isConnected } = useSocket();

  console.log(patient, "patient");

  React.useEffect(() => {
    const leave = () => {
      socket.emit("leaveGroup", { cabinet, clientType: "controller" });
    };

    window.addEventListener("beforeunload", leave);

    return () => {
      window.removeEventListener("beforeunload", leave);
    };
  }, []);

  const newPatient = (message: any) => {
    const { newPatient } = message;
    setPatient(newPatient);
  };

  const nextPatientDoctor = (message: any) => {
    const { nextPatientDoctor } = message;
    console.log(nextPatientDoctor)
    setPatientFinishDoctor(nextPatientDoctor);
  };

  const getController = () => {
    console.log(patient, "patient for screen");
    if (patient && typeof patient == "object") {
      socket.emit("aboutController", {
        doctor,
        cabinet,
        patient: patient?.id,
      });
      return;
    }
    console.log(doctor, cabinet);
    socket.emit("aboutController", {
      doctor,
      cabinet,
      patient: "Прием идет",
    });
  };

  React.useEffect(() => {
    const deleteSocket = () => {
      socket.off("newPatient", newPatient);
      socket.off("nextPatientDoctor", nextPatientDoctor);
      socket.off("getController", getController);
    };

    deleteSocket();

    if (isConnected) {
      const goPatinet =
        patient && typeof patient == "object" ? patient?.id : "Прием идет";
      socket.emit("joinGroup", {
        cabinet,
        clientType: "controller",
        doctor,
        patient: goPatinet,
      });
      socket.on("newPatient", newPatient);
      socket.on("nextPatientDoctor", nextPatientDoctor);
      socket.on("getController", getController);
    } else {
      deleteSocket();
    }

    return deleteSocket;
  }, [isConnected, patient]);

  if (!isConnected) {
    return "Технический перерыв";
  }

  return (
    <div className="">
      <button
        onClick={() => socket.emit("finishPatient", { cabinet, queueName: queue, nextDoctors: [], returnTo: true })}
      >
        111</button>
        <button
        onClick={() => socket.emit("getPatient", { cabinet, queueName: queue, nextDoctors: [], returnTo: false })}
      >
        kjbbjkb
      </button>
    </div>
  );
}

const mapState = (state: RootState) => ({
  isAdditional: state.controllerPage.isAdditional,
  patient: state.controllerPage.patient,
  nextDoctors: state.controllerPage.nextDoctors,
  step: state.controllerPage.step,
  queue: state.controllerPage.queue,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setPatient: (patient: Patient) => dispatch.controllerPage.setPatient(patient),
  setPatientFinishDoctor: (next: string) =>
    dispatch.controllerPage.setPatientFinishDoctor(next),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ControllerPageStateProps = ControllerProps & StateProps & DispatchProps;

export const ConnectController = connect(mapState, mapDispatch)(Controller);
