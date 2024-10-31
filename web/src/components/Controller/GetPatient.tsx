import React from "react";
import * as styles from "./GetPatient.module.css";
import { useSocket } from "../Socket";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";

interface GetPatientPropsNative {
  cabinet: string;
  personalId: string;
  nextStep: () => void;
}

export function GetPatient(props: GetPatientComponentProps) {
  const { socket } = useSocket();
  const { cabinet, queue, patient, reload, personalId } = props;

  const isGoldColor = patient?.isGold ? "gold" : "black";
  const turn = Math.random() < 0.5 ? 0 : 1;
  const polling = React.useRef<any>(null);

  React.useEffect(() => {
    reload();
    setTimeout(
      () =>
        socket.emit("getPatient", {
          personalId,
          profile: queue,
          room: cabinet,
          turn,
        }),
      2000
    );

    return () => {
      clearInterval(polling.current);
    };
  }, []);

  React.useEffect(() => {
    if (patient?.number == "empty") {
      if (!polling.current) {
        polling.current = setInterval(() => {
          console.log(polling);
          socket.emit("getPatient", {
            personalId,
            profile: queue,
            room: cabinet,
            turn,
          });
        }, 3000);
      }
    } else {
      clearInterval(polling.current);
    }
  }, [patient?.number]);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column w-100 pt-4 pb-4">
      {patient?.number !== "empty" ? (
        <>
          <div>Вы принимаете пациента под номером</div>
          <div
            style={{ fontSize: "3rem", color: isGoldColor }}
            className="flex-fill d-flex align-items-center"
          >
            {patient?.number}
          </div>
          {patient?.number ? (
            <div
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
            </div>
          ) : null}
        </>
      ) : (
        <div style={{ fontSize: "3rem" }}>Очередь пуста</div>
      )}
    </div>
  );
}

const mapState = (state: RootState) => ({
  isAdditional: state.controllerPage.isAdditional,
  patient: state.controllerPage.patient,
  queue: state.controllerPage.queue,
});

const mapDispatch = (dispatch: Dispatch) => ({
  reload: dispatch.controllerPage.reload,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type GetPatientComponentProps = GetPatientPropsNative &
  StateProps &
  DispatchProps;

export const GetPatientStep = connect(mapState, mapDispatch)(GetPatient);
