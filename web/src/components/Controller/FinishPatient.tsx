import React from "react";
import * as styles from "./GetPatient.module.css";

interface FinishPatientProps {
  patientNumber?: string;
  nextStep?: () => void;
}

export function FinishPatient(props: FinishPatientProps) {
  return (
    <div className="d-flex align-items-center justify-content-around flex-column w-100">
      <div style={{ fontSize: "1.5rem", color: "green", textAlign: "center" }}>Следующее направлвение пациента - УЗИ</div>
    </div>
  );
}
