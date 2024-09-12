import React from "react";
import * as styles from "./Doctor.module.css";
import logo from "../../assets/medicineLogo.svg";

interface HelloDoctorProps {
  start: () => void;
}

export default function HelloDoctor(props: HelloDoctorProps) {
  const { start } = props;
  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 h-100"
      style={{
        backgroundColor: "#FFFAFA",
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ gap: "40px" }}
      >
        <img src={logo} style={{ width: "15%", height: "15%" }} />
        <p style={{ fontSize: "2rem", textAlign: "center" }}>
          Добро пожаловать в систему управления
          <br />
          потоком пациетнов
        </p>
        <div className="d-flex justify-content-center" style={{ gap: "50%" }}>
          <div className={styles.blackStyleButton} onClick={() => start()}>
            <p
              style={{
                width: "150px",
                textAlign: "center",
                fontSize: "1.3rem",
              }}
            >
              Начать
            </p>
          </div>
          <div className={styles.blackStyleButton}>
            <p
              style={{
                width: "150px",
                textAlign: "center",
                fontSize: "1.3rem",
              }}
            >
              Инструкция
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
