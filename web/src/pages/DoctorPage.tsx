import React from "react";
import HelloDoctor from "../components/Doctor/HelloDoctor";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";
import ChooseDoctorLogo from "../assets/chooseLogo.svg";
import { Navigate } from "react-router-dom";
import { ChooseDoctor } from "../components/Doctor/ChooseDoctor";
import { ChooseCabinet } from "../components/Doctor/ChooseCabinet";

function DoctorPageComponent(props: DoctorPageProps) {
  const { step, name, isAdditional, cabinet } = props.doctorInfo;
  const { prevStep, startDoctor, setDoctor, setCabinet, reload } = props;

  console.log(name);

  React.useEffect(() => {
    return () => {
      reload();
    };
  }, []);

  const renderHelloDoctor = () => {
    return (
      <>
        <HelloDoctor start={startDoctor} />
      </>
    );
  };

  const renderChooseDoctor = () => {
    return (
      <ChooseDoctor
        key="doctor"
        doctorUrl="doctor"
        additionalUrl="additional/all"
        img={ChooseDoctorLogo}
        prev={prevStep}
        setDoctor={setDoctor}
        setCabinet={setCabinet}
      />
    );
  };

  const renderChooseCabinet = () => {
    return (
      <ChooseCabinet
        cabinetUrl="cabinet/all"
        setCabinet={setCabinet}
        img={ChooseDoctorLogo}
        prev={prevStep}
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

  console.log(isAdditional, name, cabinet);

  if (name && cabinet) {
    const additional = isAdditional ? "additional" : "notadditional";
    const to = `/controller/${name}/${cabinet}/${additional}`;
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
  setCabinet: (payload: string) => dispatch.doctorPage.setCabinet(payload),
  reload: () => dispatch.doctorPage.reload(),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type DoctorPageProps = StateProps & DispatchProps;

export const DoctorPage = connect(mapState, mapDispatch)(DoctorPageComponent);
