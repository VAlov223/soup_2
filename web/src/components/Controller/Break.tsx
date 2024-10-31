import React from "react";
import { useSocket } from "../Socket";

interface BreakProps {
  cabinet: string;
}

export function Break(props: BreakProps) {
  const { socket } = useSocket();

  React.useEffect(() => {
    socket?.emit("setBreak", { room: props.cabinet });

    return () => {
      socket?.emit("finishBreak", { room: props.cabinet });
    };
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center flex-column w-100">
      <div style={{ fontSize: "2rem" }}>Идет перерыв</div>
    </div>
  );
}
