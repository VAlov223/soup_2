import React from "react";
import { RootState, Dispatch } from "../store";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import load from "../assets/loadData.gif";
import { ConnectController } from "../components/Controller/Controller";
import { splitByFirstOccurrence } from "../services/splitChar";
import { MAIN_URL } from "../utils";

interface ControllerPageProps {}

export function ControllerPage(props: ControllerPageStateProps) {
  const [check, setCheck] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = React.useState<string>("");
  const { doctor, cabinet, additional } = useParams();

  const urlAdditional = additional == "additional" ? "true" : "false";

  const checkCabinetAndDoctor = async () => {
    try {
      setLoading(true);
      // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
      const data = await fetch(
        `${MAIN_URL}doctor/check/${doctor}/${cabinet}?isAdditional=${urlAdditional}`
      );
      const result = await data.json();
      if (result.statusCode == 404 || !result) {
        setCheck(false);
        setLoading(false);
      } else {
        if (additional == "additional") {
          props.setAdditional(true);
        }
        const data = await fetch(`${MAIN_URL}doctor/${doctor}`);
        const nameResult = await data.json();
        setName(nameResult.name);
        props.setQueue(nameResult.profile);
        setCheck(true);
        setLoading(false);
      }
    } catch (err) {
      setCheck(false);
      setLoading(false);
      console.error(err);
    }
  };

  React.useEffect(() => {
    checkCabinetAndDoctor();
  }, []);

  if (!check && !loading) {
    return <Navigate to="/" />;
  }

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
  reload: dispatch.controllerPage.reload,
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
