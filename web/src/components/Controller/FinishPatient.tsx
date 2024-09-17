import React from "react";
import * as styles from "./GetPatient.module.css";
import { useSocket } from "../Socket";

interface FinishPatientProps {
  patientNumber?: string;
  cabinet: string;
  queueName: string;
  nextStep: () => void;
}

export function FinishPatient(props: FinishPatientProps) {
  return (
    <div className="d-flex align-items-center justify-content-center flex-column w-100 pt-4 pb-4"></div>
  );
}
