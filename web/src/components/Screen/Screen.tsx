import React from "react";
import * as styles from "./Screen.module.css";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { RootState, Dispatch } from "../../store";
import { connect } from "react-redux";
import { ConnectReadyScreen } from "./ReadyScreen";
import load from "../../assets/loadData.gif";

interface ScreenProps {
  fetchUrl: string;
}

export function Screen(props: ScreenProps) {
  const { cabinet } = useParams();
  const { fetchUrl } = props;

  const [loading, setLoading] = React.useState(true);
  const [check, setCheck] = React.useState(true);

  React.useEffect(() => {
    const checkCabinet = async () => {
      try {
        setLoading(true);
        const baseUrl = `${window.location.protocol}//${window.location.host}/`;
        // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
        const data = await fetch(`http://localhost:3000${fetchUrl}/${cabinet}`);
        const jsonData = await data.json();
        if (jsonData) {
          setLoading(false);
        } else {
          setCheck(false);
          setLoading(true);
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
          <ConnectReadyScreen cabinet={cabinet} />
        </>
      )}
    </>
  );
}
