import React from "react";
import * as styles from "./Screen.module.css";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { ConnectReadyScreen } from "./ReadyScreen";
import { MAIN_URL } from "../../utils";
import load from "../../assets/loadData.gif";

export function Screen() {
  const { cabinet, additional } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [check, setCheck] = React.useState(true);

  React.useEffect(() => {
    const checkCabinet = async () => {
      try {
        setLoading(true);
        let data;
        let result;
        if (additional == "additional") {
          data = await fetch(`${MAIN_URL}additional/all`);
          const jsonData = await data.json();
          result = jsonData.map((element: any) => element.name);
        } else {
          data = await fetch(`${MAIN_URL}cabinet/all`);
          const jsonData = await data.json();
          result = jsonData;
        }

        if (result?.includes(cabinet)) {
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
    checkCabinet();
  }, []);

  if (!check) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {loading ? (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
          <img src={load} width={60} height={60} />
        </div>
      ) : (
        <>
          <ConnectReadyScreen
            cabinet={cabinet}
            isAdditional={additional == "additional" ? true : false}
          />
        </>
      )}
    </>
  );
}
