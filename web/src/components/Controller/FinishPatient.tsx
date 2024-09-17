import React from "react";
import { useSocket } from "../Socket";
import * as styles from "./FinishPatient.module.css"

interface FinishPatientProps {
  patientFinishDoctor: null | string;
  cabinet: string;
  queueName: string;
  patient: any;
  nextDoctors: string[];
  isReturn: boolean;
  nextStep: () => void;
}

export function FinishPatient(props: FinishPatientProps) {
  const { cabinet, queueName, patient, isReturn, nextDoctors } = props;
  const { socket, isConnected } = useSocket();

  React.useEffect(() => {
    setTimeout(
      () =>
        socket.emit("finishPatient", {
          cabinet,
          queueName,
          nextDoctors,
          returnTo: isReturn,
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
