import React from "react";
import { useSocket } from "../Socket";
import * as styles from "./FinishPatient.module.css";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";

interface FinishPatientPropsNative {
  cabinet: string;
  personalId: string;
}

export function FinishPatient(props: FinishPatientComponentProps) {
  const { cabinet, isReturn, nextDoctors, personalId, isAdditional } = props;

  const { socket } = useSocket();

  React.useEffect(() => {
    setTimeout(
      () =>
        socket.emit("finishPatient", {
          room: cabinet,
          personalId,
          nextDoctors,
          isReturn: isAdditional ? false : isReturn,
          doctors: nextDoctors,
        }),
      1000
    );
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column w-100 pt-4 pb-4">
      <div>Сообщите пациенту следующего врача</div>
      <div
        style={{ fontSize: "2rem", color: "green" }}
        className="flex-fill d-flex align-items-center"
      >
        {props.patientFinishDoctor &&
          `Следующее направление пациента - ${props.patientFinishDoctor}`}
      </div>
      <div
        className="row"
        style={{ gap: "3%", width: "50%", margin: "0 auto" }}
      >
        {props.patientFinishDoctor && (
          <div
            onClick={() => props.nextStep()}
            className={styles.buttonStep}
            style={{ backgroundColor: "#44944A", fontSize: "1rem" }}
          >
            Завершить
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = (state: RootState) => ({
  queue: state.controllerPage.queue,
  isReturn: state.controllerPage.isReturn,
  isAdditional: state.controllerPage.isAdditional,
  nextDoctors: state.controllerPage.nextDoctors,
  patientFinishDoctor: state.controllerPage.patientFinishDoctor,
});

const mapDispatch = (dispatch: Dispatch) => ({
  nextStep: dispatch.controllerPage.nextStep,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type FinishPatientComponentProps = FinishPatientPropsNative &
  StateProps &
  DispatchProps;

export const FinishPatientStep = connect(mapState, mapDispatch)(FinishPatient);
