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
    isAdditional,
    isBreak,
    name,
    queue,
  } = props;

  const navigate = useNavigate();
  const [exit, setExit] = React.useState(false);
  const { socket, isConnected } = useSocket();

  React.useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.emit("leaveGroup", {
        room: cabinet,
        type: "controller",
        name: `${props.name} - ${props.queue}`,
        isAdditional: isAdditional,
      });
    });

    setTimeout(
      () =>
        socket.emit("joinGroup", {
          room: cabinet,
          type: "controller",
          name: `${props.name} - ${props.queue}`,
          isAdditional: isAdditional,
        }),
      1000
    );

    return () => {
      setTimeout(
        () =>
          socket.emit("leaveGroup", {
            room: cabinet,
            type: "controller",
            name: `${props.name} - ${props.queue}`,
            isAdditional: isAdditional,
          }),
        1500
      );
      props.reload();
    };
  }, []);

  const renderBreak = () => {
    if (isBreak) {
      return (
        <img
          src={play}
          onClick={() => props.stopBreak()}
          width={20}
          height={20}
          style={{ cursor: "pointer" }}
        />
      );
    }

    if (!isBreak && (step == "finishPatient" || patient?.id == "empty")) {
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

  // const renderStep = () => {
  //   switch (step) {
  //     case "getPatient":
  //       return (
  //         <GetPatient
  //           isGold={
  //             typeof patient == "object" && patient?.isGold
  //               ? patient.isGold
  //               : false
  //           }
  //           cabinet={cabinet}
  //           queueName={queue}
  //           patientNumber={typeof patient == "object" ? patient?.id : null}
  //           nextStep={nextStep}
  //         />
  //       );
  //     case "break":
  //       return <Break />;
  //     case "nextDoctors":
  //       return (
  //         <NextDoctors
  //           patient={patient}
  //           addNextDoctor={addNextDoctor}
  //           queueName={queue}
  //           nextDoctors={nextDoctors}
  //           isReturn={isReturn}
  //           changeReturn={changeReturn}
  //           fetchUrl="/api/queue"
  //           nextStep={nextStep}
  //         />
  //       );
  //     case "finishPatient":
  //       return (
  //         <FinishPatient
  //           cabinet={cabinet}
  //           queueName={queue}
  //           patientFinishDoctor={patientFinishDoctor}
  //           nextStep={nextStep}
  //           patient={patient}
  //           isReturn={isReturn}
  //           nextDoctors={nextDoctors}
  //           name={name}
  //           isAdditional={isAdditional}
  //           reload={reload}
  //         />
  //       );
  //     default:
  //       null;
  //   }
  // };

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
            {/* {renderStep()} */}
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
  stopBreak: dispatch.controllerPage.stopBreak,
  startBreak: dispatch.controllerPage.startBreak,
  reload: dispatch.controllerPage.reload,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ControllerPageStateProps = ControllerProps & StateProps & DispatchProps;

export const ConnectController = connect(mapState, mapDispatch)(Controller);
