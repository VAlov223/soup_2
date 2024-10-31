import React from "react";
import { useSocket } from "../Socket";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { Patient } from "../../models/controllerPage";
import redCross from "../../assets/crossRed.svg";
import pause from "../../assets/pause.svg";
import play from "../../assets/play.svg";
import circle from "../../assets/circle.svg";
import { GetPatientStep } from "./GetPatient";
import { NextDoctorsStep } from "./NextDoctors";
import { FinishPatientStep } from "./FinishPatient";
import { Break } from "./Break";
import { useNavigate } from "react-router-dom";

interface ControllerProps {
  cabinet: string;
  doctor: string;
  name: string;
}

export function Controller(props: ControllerPageStateProps) {
  const {
    cabinet,
    doctor,
    step,
    nextDoctors,
    patientFinishDoctor,
    patient,
    nextStep,
    isAdditional,
    isBreak,
    name,
    queue,
  } = props;

  const navigate = useNavigate();
  const [exit, setExit] = React.useState(false);
  const { socket, isConnected, setSocketStatus } = useSocket();

  const aboutController = () => {
    socket.emit("aboutController", { doctor: `${name} - ${queue}`, patient, room: cabinet });
  };

  React.useEffect(() => {
    setSocketStatus("controller");

    const InOutGroup = (param: "leaveGroup" | "joinGroup") => {
      socket.emit(param, {
        room: cabinet,
        type: "controller",
        name: `${props.name} - ${props.queue}`,
        isAdditional: isAdditional,
      });
    };

    socket.on("screenConnect", aboutController);

    const forWindow = () => InOutGroup("leaveGroup");

    window.addEventListener("beforeunload", forWindow);

    setTimeout(() => InOutGroup("joinGroup"), 1000);

    return () => {
      setTimeout(() => InOutGroup("leaveGroup"), 1500);
      setSocketStatus("");
      window.removeEventListener("beforeunload", forWindow);
      socket.off("screenConnect", aboutController);
      props.reload();
    };
  }, []);

  const renderBreak = () => {
    if (step == "break") {
      return (
        <img
          src={play}
          onClick={() => props.reload()}
          width={20}
          height={20}
          style={{ cursor: "pointer" }}
        />
      );
    }

    if (step == "finishPatient" || patient?.number == "empty") {
      return (
        <img
          src={pause}
          onClick={() => props.startBreak()}
          width={20}
          height={20}
          style={{ cursor: "pointer" }}
        />
      );
    }

    return <img src={circle} width={20} height={20} />;
  };

  const renderStep = () => {
    switch (step) {
      case "getPatient":
        return (
          <GetPatientStep
            cabinet={cabinet}
            personalId={doctor}
            nextStep={nextStep}
          />
        );
      case "break":
        return <Break cabinet={cabinet} />;
      case "nextDoctors":
        return <NextDoctorsStep fetchUrl="queue" />;
      case "finishPatient":
        return <FinishPatientStep cabinet={cabinet} personalId={doctor} />;
      default:
        null;
    }
  };

  return (
    <>
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
          className="p-3 d-flex flex-column"
        >
          <div className="d-flex align-items-start justify-content-between">
            {renderBreak()}
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
              onClick={() => setExit(true)}
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
    </>
  );
}

const mapState = (state: RootState) => ({
  isAdditional: state.controllerPage.isAdditional,
  patient: state.controllerPage.patient,
  nextDoctors: state.controllerPage.nextDoctors,
  step: state.controllerPage.step,
  queue: state.controllerPage.queue,
  isReturn: state.controllerPage.isReturn,
  patientFinishDoctor: state.controllerPage.patientFinishDoctor,
  isBreak: state.controllerPage.isBreak,
});

const mapDispatch = (dispatch: Dispatch) => ({
  startBreak: dispatch.controllerPage.startBreak,
  reload: dispatch.controllerPage.reload,
  nextStep: dispatch.controllerPage.nextStep,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ControllerPageStateProps = ControllerProps & StateProps & DispatchProps;

export const ConnectController = connect(mapState, mapDispatch)(Controller);
