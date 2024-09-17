import React from "react";
import { useSocket } from "../Socket";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { Patient } from "../../models/controllerPage";
import redCross from "../../assets/crossRed.svg";
import pause from "../../assets/pause.svg";
import play from "../../assets/play.svg";
import circle from "../../assets/circle.svg";
import { GetPatient } from "./GetPatient";
import { Break } from "./Break";
import { NextDoctors } from "./NextDoctors";
import { FinishPatient } from "./FinishPatient";
import { validate } from "webpack";

interface ControllerProps {
  cabinet: string;
  doctor: string;
  name: string;
}

export function Controller(props: ControllerPageStateProps) {
  const {
    cabinet,
    doctor,
    setPatient,
    setPatientFinishDoctor,
    step,
    nextDoctors, 
    patient,
    isAdditional,
    setBreakStep,
    addNextDoctor,
    reload,
    finishBreak,
    nextStep,
    name,
    queue,
  } = props;
  const { socket, isConnected } = useSocket();

  const polling = React.useRef<any>(false);

  React.useEffect(() => {
    const leave = () => {
      socket.emit("leaveGroup", { cabinet, clientType: "controller" });
    };

    window.addEventListener("beforeunload", leave);

    return () => {
      reload()
      window.removeEventListener("beforeunload", leave);
    };
  }, []);

  const setBreak = () => {
    if (polling.current) {
      clearInterval(polling.current);
      polling.current = false;
    }
    setBreakStep();
  };

  const newPatient = (message: any) => {
    const { newPatient } = message;
    console.log(message, "newPatient");
    if (newPatient.id == "-1" && !polling.current) {
      polling.current = setInterval(
        () => socket.emit("getPatient", { cabinet, queueName: queue }),
        3000
      );
    }

    if (newPatient.id !== "-1" && polling.current) {
      clearInterval(polling.current);
      polling.current = false;
    }

    console.log("пришел пациент");

    setPatient(newPatient);
  };

  const nextPatientDoctor = (message: any) => {
    const { nextPatientDoctor } = message;
    console.log(nextPatientDoctor);
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

  const renderBreakBtn = () => {

    if (step == "break") {
      return (
        <img
          onClick={finishBreak}
          src={play}
          width={30}
          height={30}
          style={{ cursor: "pointer" }}
        />
      );
    }

    if (step == "finishPatient" ||  patient?.id == "-1" || !patient) {
      return (
        <img
          onClick={setBreak}
          src={pause}
          width={30}
          height={30}
          style={{ cursor: "pointer" }}
        />
      );
    }

    return <img src={circle} width={30} height={30} />;
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

  console.log(patient, 'patient')

  const renderStep = () => {
    switch (step) {
      case "getPatient":
        return (
          <GetPatient
            isGold={
              typeof patient == "object" && patient?.isGold
                ? patient.isGold
                : false
            }
            cabinet={cabinet}
            queueName={queue}
            patientNumber={typeof patient == "object" ? patient?.id : null}
            nextStep={nextStep}
          />
        );
      case "break":
        return <Break />;
      case "nextDoctors":
        return (
          <NextDoctors
            addNextDoctor={addNextDoctor}
            doctors={
              typeof patient == "object" && patient?.doctors
                ? patient?.doctors
                : []
            }
            queueName={queue}
            nextDoctors={nextDoctors}
            fetchUrl="/api/queue"
          />
        );
      case "finishPatient":
        return <FinishPatient />;
      default:
        null;
    }
  };

  return (
    <div
      className="w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "rgb(248, 248, 255)" }}
    >
      <div
        style={{
          minHeight: "70%",
          minWidth: "70%",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
        className=" p-3 d-flex flex-column"
      >
        <div className="d-flex align-items-start justify-content-between">
          {renderBreakBtn()}
          <div className="d-flex flex-column">
            <div
              style={{
                fontSize: "1.1rem",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {name}
            </div>
            <div
              className="w-100"
              style={{ height: "2px", backgroundColor: "black" }}
            ></div>
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {queue}
            </div>
          </div>
          <img
            src={redCross}
            width={20}
            height={20}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="flex-fill d-flex justify-content-center">
          {renderStep()}
        </div>
        <div
          className="d-flex justify-content-center"
          style={{ fontSize: "1.1rem" }}
        >
          {`Вы ведете прием в ${cabinet}`}
        </div>
      </div>
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
  setBreakStep: () => dispatch.controllerPage.setBreak(),
  finishBreak: () => dispatch.controllerPage.finishBreak(),
  nextStep: () => dispatch.controllerPage.nextStep(),
  addNextDoctor: (value: string) =>
    dispatch.controllerPage.addNextDoctor(value),
  reload: () => { 
    dispatch.controllerPage.reload()
  }
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ControllerPageStateProps = ControllerProps & StateProps & DispatchProps;

export const ConnectController = connect(mapState, mapDispatch)(Controller);
