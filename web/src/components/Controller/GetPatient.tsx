import React from "react";
import * as styles from "./GetPatient.module.css";
import { useSocket } from "../Socket";

interface GetPatientProps {
  cabinet: string;
  queueName: string;
  patientNumber?: string | number | null;
  isGold: boolean;
  nextStep: () => void;
}

export function GetPatient(props: GetPatientProps) {
  const { socket, isConnected } = useSocket();
  const { cabinet, queueName, isGold } = props;

  const isGoldColor =  isGold ? 'gold' : "black" 

  React.useEffect(() => {
    console.log(2005)
    setTimeout(() => socket.emit("getPatient", {cabinet, queueName: queueName}), 3000)
  }, []);

  console.log(props.patientNumber, ';')

  return (
    <div className="d-flex align-items-center justify-content-center flex-column w-100 pt-4 pb-4">
      {props.patientNumber !== "-1" ? (
        <>
          <div>Вы принимаете пациента под номером</div>
          <div style={{ fontSize: "3rem", color: isGoldColor}} className="flex-fill d-flex align-items-center">{props.patientNumber}</div>
          { props.patientNumber ? <div
            className="row"
            style={{ gap: "3%", width: "50%", margin: "0 auto" }}
          >
            <div
              className={`${styles.buttonStep} col`}
              style={{ backgroundColor: "#960018" }}
            >
              Не явился
            </div>
            <div
              className={`${styles.buttonStep} col`}
              style={{ backgroundColor: "#44944A" }}
              onClick={props.nextStep}
            >
              Закончить прием
            </div>
            <div
              className={`${styles.buttonStep} col`}
              style={{ backgroundColor: "#ED760E" }}
            >
              Вызвать повторно
            </div>
          </div> : null} 
        </>
      ) : (
        <div style={{ fontSize: "3rem" }}>Очередь пуста</div>
      )}
    </div>
  );
}
