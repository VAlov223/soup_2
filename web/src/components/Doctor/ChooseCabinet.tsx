import React from "react";
import * as styles from "./Doctor.module.css";
import logo from "../../assets/chooseLogo.svg";
import search from "../../assets/search.svg";
import back from "../../assets/backArrow.svg";
import { LoadingData } from "../Load";
import { Input } from "../tools/Input";
import { MAIN_URL } from "../../utils";

interface ChooseCabinetProps {
  cabinetUrl: string;
  prev: () => void;
  setCabinet: (data: string) => void;
  img: any;
}

export function ChooseCabinet(props: ChooseCabinetProps) {
  const { cabinetUrl, img, prev, setCabinet } = props;
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(1);
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(1);
        const dataCabinet = await fetch(
          `${MAIN_URL}${cabinetUrl}/?search=${search}`
        );
        const jsonDataCabinets = await dataCabinet.json();
        setData(jsonDataCabinets);
        setLoading(0);
      } catch (err) {
        setLoading(1);
        console.error(err);
      }
    };
    getData();
  }, [search]);

  const onClickData = (element: any) => {
    setCabinet(element);
  };

  const renderData = () => {
    if (!loading) {
      return (
        <div
          className="w-100 d-flex flex-column p-3"
          style={{ overflowY: "auto", gap: "10px" }}
        >
          {data.map((element, index) => {
            return (
              <div key={index} className={styles.blackStyleButton}>
                <p
                  style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    padding: "1.3%",
                  }}
                  onClick={() => {
                    return onClickData(element);
                  }}
                >
                  {element}
                </p>
              </div>
            );
          })}
        </div>
      );
    } else if (loading == -1) {
      return (
        <div
          className="h-50 w-100 d-flex align-items-center justify-content-center"
          style={{ fontSize: "1.5rem" }}
        >
          <p>Не удалось получить данные</p>
        </div>
      );
    } else {
      return <LoadingData />;
    }
  };

  return (
    <div
      className="w-100 h-100"
      style={{
        backgroundColor: "#FFFAFA",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        src={back}
        alt=""
        width={30}
        height={30}
        onClick={() => prev()}
        style={{
          position: "absolute",
          left: "4%",
          top: "4%",
          cursor: "pointer",
        }}
      />
      <div className="h-100 w-100" style={{ padding: "2%" }}>
        <div
          className="d-flex flex-column align-items-center"
          style={{
            width: "70%",
            height: "100%",
            margin: "0 auto",
            gap: "10px",
          }}
        >
          <img src={img} width={100} height={100}></img>
          <div
            className="w-100 mt-3 p-2 d-flex flex-column"
            style={{
              backgroundColor: " #FFFFFF",
              borderRadius: "20px",
              flex: 1,
              overflowY: "hidden",
            }}
          >
            <Input setValue={setSearch} />
            {renderData()}
          </div>
        </div>
      </div>
    </div>
  );
}
