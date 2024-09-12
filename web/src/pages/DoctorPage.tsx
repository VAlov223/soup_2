import React from "react";
import HelloDoctor from "../components/Doctor/HelloDoctor";
import Choose from "../components/Doctor/Choose";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";
import ChooseDoctorLogo from "../assets/chooseLogo.svg";
import { Navigate } from "react-router-dom";

function DoctorPageComponent(props: DoctorPageProps) {
  const { step, name, isAdditional, cabinet } = props.doctorInfo;
  const { prevStep, startDoctor, setDoctor, setCabinet, reload } = props;

  React.useEffect(() => {
    return () => {
      reload();
    };
  }, []);

  const setCabinetStep = (data: { [P: string]: string[] }, value: string) => {
    if (value && typeof value == "string") {
      let payload: { cabinet: string };
      if (data?.free?.includes(value)) {
        payload = { cabinet: value };
        setCabinet(payload);
      }
    }
  };

  const setDoctorStep = (data: { [P: string]: any }, value: any) => {
    if ("doctors" in data && "additionals" in data) {
      if (data.additionals.includes(value)) {
        setDoctor({ name: value, isAdditional: true });
      } else {
        setDoctor({ name: value, isAdditional: false });
      }
    }
    return;
  };

  const doctorDataRender = (data: { [P: string]: any }) => {
    let result: string[] = [];
    Object.values(data).forEach((element: any) => {
      if (element && Array.isArray(element)) {
        result = [...result, ...element];
      }
    });
    console.log(result.sort());
    return result;
  };

  const cabinetDataRender = (data: { [P: string]: any }) => {
    let result: string[] = [];
    console.log(data);
    console.log(step);
    console.log(10);
    if ("free" in data) {
      result = data.free;
    }
    return result.sort();
  };

  const renderHelloDoctor = () => {
    return (
      <>
        <HelloDoctor start={startDoctor} />
      </>
    );
  };

  const renderChooseDoctor = () => {
    return (
      <>
        <Choose
          key="doctor"
          fetchUrl="/api/doctor"
          img={ChooseDoctorLogo}
          prev={prevStep}
          setValue={setDoctorStep}
          dataRender={doctorDataRender}
        />
      </>
    );
  };

  const renderChooseCabinet = () => {
    return (
      <Choose
        key="cabinet"
        fetchUrl="/api/cabinet"
        img={ChooseDoctorLogo}
        prev={prevStep}
        setValue={setCabinetStep}
        dataRender={cabinetDataRender}
      />
    );
  };

  const render = () => {
    switch (step) {
      case "helloDoctor":
        return renderHelloDoctor();
      case "chooseDoctor":
        return renderChooseDoctor();
      case "chooseCabinet":
        return renderChooseCabinet();
      default:
        return null;
    }
  };

  if (isAdditional) {
    const to = `/controller/УЗИ/'УЗИ'`;
    return <Navigate to="/controller/УЗИ/УЗИ" />;
  }

  if (name && cabinet) {
    const to = `/controller/${encodeURIComponent(name)}/${encodeURIComponent(
      cabinet
    )}`;
    return <Navigate to={to} />;
  }

  return <>{render()}</>;
}

const mapState = (state: RootState) => ({
  doctorInfo: state.doctorPage,
});

const mapDispatch = (dispatch: Dispatch) => ({
  prevStep: () => dispatch.doctorPage.prevStep(),
  startDoctor: () => dispatch.doctorPage.startDoctor(),
  setDoctor: (payload: { name: string; isAdditional: boolean }) =>
    dispatch.doctorPage.setDoctor(payload),
  setCabinet: (payload: { cabinet: string }) =>
    dispatch.doctorPage.setCabinet(payload),
  reload: () => dispatch.doctorPage.reload(),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type DoctorPageProps = StateProps & DispatchProps;

export const DoctorPage = connect(mapState, mapDispatch)(DoctorPageComponent);
