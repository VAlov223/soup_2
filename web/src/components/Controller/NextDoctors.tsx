import React from "react";
import * as styles from "./NextDoctors.module.css";
import ready from "../../assets/ready.svg";
import load from "../../assets/loadData.gif";
import { Patient } from "../../models/controllerPage";

interface NextDoctorsProps {
  patient: Patient | null;
  addNextDoctor: (value: string) => void;
  nextDoctors: string[];
  queueName: string;
  isReturn: boolean;
  changeReturn: () => void;
  fetchUrl: string;
  nextStep: () => void;
}

export function NextDoctors(props: NextDoctorsProps) {
  const { queueName, nextDoctors, addNextDoctor, patient } = props;
  const [allDoctors, setAllDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const baseUrl = `${window.location.protocol}//${window.location.host}/`;
        // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
        console.log(20);
        const data = await fetch(`http://localhost:3000${props.fetchUrl}`);
        const jsonData = await data.json();
        const realData = jsonData.queues ? jsonData.queues : [];
        console.log(realData);
        setAllDoctors(realData);
        setLoading(false);
      } catch (err) {
        setLoading(true);
        console.error(err);
      }
    };
    getData();
  }, []);

  const renderDoctorButton = () => {
    return allDoctors.map((element, index) => {
      if (element == props.queueName) {
        return (
          <div
            className={`col-3 mb-2 ${styles.nextButton}`}
            onClick={props.changeReturn}
          >
            Вернуть ко мне
            {props.isReturn ? (
              <img
                src={ready}
                width={20}
                height={20}
                className="position-absolute"
                style={{ top: -5, right: -10 }}
              />
            ) : null}
          </div>
        );
      }

      return (
        <div
          className={`col-3 mb-2 ${styles.nextButton}`}
          onClick={(ev: any) => addNextDoctor(element)}
          style={{
            pointerEvents:
              props.patient?.doctors.includes(element) ||
              props.patient?.returnTo.includes(element)
                ? "none"
                : "auto",
          }}
        >
          {element}
          {nextDoctors.includes(element) ||
          props.patient?.doctors.includes(element) ||
          props.patient?.returnTo.includes(element) ? (
            <img
              src={ready}
              width={20}
              height={20}
              className="position-absolute"
              style={{ top: -5, right: -10 }}
            />
          ) : null}
        </div>
      );
    });
  };

  return (
    <div className="d-flex flex-column d-flex align-items-center justify-content-between flex-column w-100 pt-4 pb-4">
      {!loading ? (
        <>
          <div>Отметьте следующих врачей для пациента</div>
          <div
            className="row justify-content-center"
            style={{ width: "60%", margin: "0 auto", gap: "4%" }}
          >
            {renderDoctorButton()}
          </div>
          <div
            className="row"
            style={{ gap: "3%", width: "20%", margin: "0 auto" }}
          >
            <div
              onClick={() => props.nextStep()}
              className={`${styles.buttonStep} col`}
              style={{ backgroundColor: "#44944A", fontSize: "1rem" }}
            >
              Закончить прием
            </div>
          </div>
        </>
      ) : (
        <img src={load} width={15} height={15} />
      )}
    </div>
  );
}
