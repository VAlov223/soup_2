import React from "react";
import * as styles from "./Screen.module.css";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { useSocket } from "../Socket";

interface ReadyScreenProps {
  cabinet: string;
}

function ReadyScreen(props: ScreenStateProps) {
  const {
    doctor,
    patient,
    isBreak,
    isActive,
    setDoctor,
    setBreak,
    finishBreak,
    setUnActive,
    setActive, 
    setPatient,
    cabinet,
  } = props;

  const { socket, isConnected } = useSocket();

  console.log(isBreak)

  React.useEffect(() => {
    const deleteSocket = () => {
      socket.off("controllerLeave", controllerLeave);
      socket.off("aboutController", aboutController);
      socket.off("newPatient", newPatient);
      socket.off("setBreak", goBreak);
      socket.off("finishBreak", finishBreak);
    };

    const controllerLeave = () => {
      setUnActive();
    };

    const newPatient = (message: any) => {
      const { newPatient } = message;
      console.log(newPatient);
      setPatient(newPatient.id);
    };

    const aboutController = (message: any) => {
      console.log('yees')
      const { doctor, patient } = message;
      console.log(patient)
      setDoctor(doctor);
      setPatient(patient);
      setActive()
    };

    const goBreak = () => {
      setBreak();
    };

    const stopBreak = () => {
      console.log(20)
      finishBreak();
    };

    if (isConnected) {
      socket.emit("joinGroup", { cabinet, clientType: "screen" });
      socket.on("controllerLeave", controllerLeave);
      socket.on("newPatient", newPatient);
      socket.on("setBreak", goBreak);
      socket.on("finishBreak", stopBreak);
      socket.on("aboutController", aboutController);
    }

    else { 
      console.log('сбрасываем')
      deleteSocket()
    }

    return deleteSocket;
  }, [isConnected]);

  const renderNumber = () => {
    if (!patient || patient == "-1") {
      return <p></p>;
    }
    if (isBreak && isActive) {
      return <p >Проветривание</p>;
    } else if (isActive) {
      return <h2 >{patient}</h2>;
    } else if (!isActive) {
      return <p >Прием не ведётся</p>;
    }
  };

  if (!isConnected) {
    return "Технический перерыв";
  }

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

const mapDispatch = (dispatch: Dispatch) => ({
  setDoctor: (doctor: { doctor: string }) =>
    dispatch.screenPage.setDoctor(doctor),
  setBreak: () => dispatch.screenPage.setBreak(),
  finishBreak: () => dispatch.screenPage.finishBreak(),
  setPatient: (patient: any) => dispatch.screenPage.setPatient(patient),
  setUnActive: () => dispatch.screenPage.setUnActive(),
  setActive: () => dispatch.screenPage.setActive(), 
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ScreenStateProps = ReadyScreenProps & StateProps & DispatchProps;

export const ConnectReadyScreen = connect(mapState, mapDispatch)(ReadyScreen);
