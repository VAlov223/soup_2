import React from "react";
import * as styles from "./NextDoctors.module.css";
import ready from "../../assets/ready.svg";
import load from "../../assets/loadData.gif";

interface NextDoctorsProps {
  addNextDoctor: (value: string) => void;
  nextDoctors: string[];
  doctors: string[];
  queueName: string;
  fetchUrl: string;
}

export function NextDoctors(props: NextDoctorsProps) {
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

  const renderDoctorButton = (element: string) => {
    let name = element 
    if (element == props.queueName) {
      name  = "Вернуть ко мне";
    }
    if (props.doctors.includes(element)) {
      return (
        <img
          src={ready}
          width={20}
          height={20}
          className="position-absolute"
          style={{ top: -5, right: -10 }}
        />
      );
    }


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
            {allDoctors.map((element, index) => {
              return (
                <div className={`col-3 mb-2 ${styles.nextButton}`}>
                  {element == props.queueName ? "Вернуть ко мне" : element}
                  {props.doctors.includes(element) ? (
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
            })}
          </div>
          <div
            className="row"
            style={{ gap: "3%", width: "20%", margin: "0 auto" }}
          >
            <div
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
