import React from "react";
import doctor from "../../assets/doctorsAdmin.svg";
import cabinet from "../../assets/cabinets.svg";
import queue from "../../assets/queue.svg";
import { Link } from "react-router-dom";

interface AdminPanelProps {
  screenWidth: number;
}

export function AdminPanel(props: AdminPanelProps) {
  const names = [
    { name: "Врачи", link: "" },
    { name: "Кабинеты", link: "cabinets" },
    { name: "Очереди", link: "queues" },
    { name: "Направления", link: "additionals" },
  ];
  return (
    <div className="d-flex flex-column" style={{ gap: "10px" }}>
      <Link to="" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ cursor: "pointer" }}>
          <img
            src={doctor}
            width={25}
            height={25}
            style={{ marginRight: "10px" }}
          />
          Врачи
        </div>
      </Link>
      <Link
        to="additionals"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div style={{ cursor: "pointer" }}>
          <img
            src={queue}
            width={25}
            height={25}
            style={{ marginRight: "10px" }}
          />
          Направления
        </div>
      </Link>
      <Link to="cabinets" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ cursor: "pointer" }}>
          <img
            src={cabinet}
            width={25}
            height={25}
            style={{ marginRight: "10px" }}
          />
          Кабинеты
        </div>
      </Link>
      <Link to="queues" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ cursor: "pointer" }}>
          <img
            src={queue}
            width={25}
            height={25}
            style={{ marginRight: "10px" }}
          />
          Очереди
        </div>
      </Link>
    </div>
  );
}
