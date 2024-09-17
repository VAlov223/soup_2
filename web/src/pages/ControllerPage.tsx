import React from "react";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import load from "../assets/loadData.gif";
import { ConnectController } from "../components/Controller/Controller";
import { splitByFirstOccurrence } from "../services/splitChar";

interface ControllerPageProps {
  fetchUrl: string;
}

export function ControllerPage(props: ControllerPageStateProps) {
  const [check, setCheck] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const { cabinet, doctor } = useParams();

  React.useEffect(() => {
    const checkCabinetAndDoctor = async () => {
      try {
        setLoading(true);
        const baseUrl = `${window.location.protocol}//${window.location.host}/`;
        // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
        const data = await fetch(
          `http://localhost:3000${props.fetchUrl}/${doctor}/${cabinet}`
        );
        const jsonData = await data.json();
        console.log(jsonData);
        if (jsonData?.check) {
          const isAdditional = jsonData?.isAdditional;
          console.log(jsonData?.isAdditional, "sfsdfsdf");
          props.setAdditional(isAdditional);
          let queue = "";
          let name = "";
          if (isAdditional) {
            queue = doctor || "";
          } else {
            const doctorSplit = splitByFirstOccurrence(doctor, '-')
            console.log(doctorSplit, 'doctorSplit')
            name = typeof doctorSplit == "object" ? doctorSplit[0].trim() : "";
            queue = typeof doctorSplit == "object" ? doctorSplit[1].trim() : "";
            setName(name);
          }
          props.setQueue(queue);
          setCheck(true);
          setLoading(false);
        } else {
          setCheck(false);
          setLoading(false);
        }
      } catch (err) {
        setLoading(true);
        console.error(err);
      }
    };
    checkCabinetAndDoctor();
  }, []);

  console.log(check, "check");

  if (!check && !loading) {
    return <Navigate to="/" />;
  }

  console.log(props.isAdditional);

  return (
    <>
      {loading ? (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <img src={load} width={60} height={60} />
        </div>
      ) : (
        <ConnectController
          cabinet={cabinet as string}
          doctor={doctor as string}
          name={name}
        />
      )}
    </>
  );
}

const mapState = (state: RootState) => ({
  isAdditional: state.controllerPage.isAdditional,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setAdditional: (value: boolean) =>
    dispatch.controllerPage.setAdditional(value),
  setQueue: (value: string) => {
    dispatch.controllerPage.setQueue(value);
  },
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type ControllerPageStateProps = ControllerPageProps &
  StateProps &
  DispatchProps;

export const ConnectControllerPage = connect(
  mapState,
  mapDispatch
)(ControllerPage);
