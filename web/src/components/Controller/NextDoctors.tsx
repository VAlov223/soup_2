import React from "react";
import * as styles from "./NextDoctors.module.css";
import ready from "../../assets/ready.svg";
import prev from "../../assets/prev.svg";
import load from "../../assets/loadData.gif";
import { Patient } from "../../models/controllerPage";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { MAIN_URL } from "../../utils";

interface NextDoctorsPropsNative {
  fetchUrl: string;
}

export function NextDoctors(props: NextDoctorComponentProps) {
  const { queue, addNextDoctor, patient, nextDoctors } = props;
  const [allDoctors, setAllDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  console.log(props.isAdditional)
  const patientPrevs = patient?.prev
    ? patient?.prev.map((element) => element.profile)
    : [];

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetch(`${MAIN_URL}${props.fetchUrl}`);
        const jsonData = await data.json();
        const realData = jsonData?.map((element: any) => element.name);
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
      if (element == props.queue) {
        return (
          <>
            {!props.isAdditional && (
              <div
                className={`col-3 mb-2 ${styles.nextButton} align-items-center`}
                onClick={props.changeReturn}
              >
                Не возвращать пациета ко мне
                {!props.isReturn ? (
                  <img
                    src={ready}
                    width={20}
                    height={20}
                    className="position-absolute"
                    style={{ top: -5, right: -10 }}
                  />
                ) : null}
              </div>
            )}
          </>
        );
      }

      return (
        <div
          className={`col-3 mb-2 ${styles.nextButton} d-flex align-items-center`}
          onClick={(ev: any) => addNextDoctor(element)}
          style={{
            pointerEvents: props.patient?.steps?.includes(element)
              ? "none"
              : "auto",
          }}
        >
          {element}
          {nextDoctors.includes(element) ||
          props.patient?.steps?.includes(element) ? (
            <img
              src={ready}
              width={20}
              height={20}
              className="position-absolute"
              style={{ top: -5, right: -10 }}
            />
          ) : null}
          {patientPrevs.includes(element) ? (
            <img
              src={prev}
              width={20}
              height={20}
              className="position-absolute"
              style={{ top: -5, right: 10 }}
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

const mapState = (state: RootState) => ({
  patient: state.controllerPage.patient,
  queue: state.controllerPage.queue,
  isReturn: state.controllerPage.isReturn,
  isAdditional: state.controllerPage.isAdditional,
  nextDoctors: state.controllerPage.nextDoctors,
});

const mapDispatch = (dispatch: Dispatch) => ({
  changeReturn: dispatch.controllerPage.changeReturn,
  addNextDoctor: dispatch.controllerPage.addNextDoctor,
  nextStep: dispatch.controllerPage.nextStep,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type NextDoctorComponentProps = NextDoctorsPropsNative &
  StateProps &
  DispatchProps;

export const NextDoctorsStep = connect(mapState, mapDispatch)(NextDoctors);
