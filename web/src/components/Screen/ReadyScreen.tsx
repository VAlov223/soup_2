import React from "react";
import * as styles from "./Screen.module.css";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { useSocket } from "../Socket";

interface ReadyScreenProps {
  cabinet: string;
  isAdditional: boolean;
}

function ReadyScreen(props: ScreenStateProps) {
  const { doctor, patient, isBreak, isActive, cabinet } = props;
  const { socket } = useSocket();

  console.log(isBreak);

  React.useEffect(() => {
    socket.emit("joinGroup", {
      room: cabinet,
      type: "screen",
      isAdditional: props.isAdditional,
    });

    return () => {
      socket.emit("leaveGroup", {
        room: cabinet,
        type: "screen",
        isAdditional: props.isAdditional,
      });
    };
  }, []);

  const renderNumber = () => {
    if (!isActive) {
      return <p>Прием не ведётся</p>;
    }

    if (isBreak && isActive) {
      return <p>Проветривание</p>;
    }

    if (isActive) {
      return <h2>{patient?.number !== "empty" ? patient?.number : ""}</h2>;
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <p>СПБ ГБУЗ "ДГМКЦ ВМТ им. К.А.Раухфуса"</p>
            <p>+7(812)506-06-06</p>
          </nav>
        </div>
      </header>
      <section className={styles.mainSection}>
        <div className={styles.tablo}>
          <h3 className={styles.placeName}>{cabinet}</h3>
          <h4 id="doctor_name">{doctor}</h4>
          <div className={styles.border}></div>
          <div className={styles.patientNumber}>{renderNumber()}</div>
        </div>
      </section>{" "}
    </>
  );
}

const mapState = (state: RootState) => ({
  doctor: state.screenPage.doctor,
  patient: state.screenPage.patient,
  isBreak: state.screenPage.isBreak,
  isActive: state.screenPage.isActive,
});

const mapDispatch = (dispatch: Dispatch) => ({});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ScreenStateProps = ReadyScreenProps & StateProps & DispatchProps;

export const ConnectReadyScreen = connect(mapState, mapDispatch)(ReadyScreen);
