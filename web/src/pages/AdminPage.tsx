import React from "react";
import { AdminHeader } from "../components/Admin/AdminHeader"
import { AdminPanel } from "../components/Admin/AdminPanel";
import { Outlet } from "react-router-dom";

interface AdminPageProps {}

export function AdminPage() {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  React.useEffect(() => {
    const resizeHandle = handleResize;
    window.addEventListener("resize", resizeHandle);
    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, []);

  return (
    <div
      className="h-100 w-100 d-flex flex-column"
      style={{ background: "#F8F8FF" }}
    >
      <AdminHeader screenWidth={screenWidth} />
      <div
        className="p-4"
        style={{ maxWidth: "1300px", overflow: "hidden", width: "100%", margin: "0 auto", flex: "1 0 0" }}
      >
        <div className="h-100"> 
        <div className="d-flex h-100" style={{ gap: "10px" }}>
          <div
            className="h-100 p-4"
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              paddingLeft: "6%",
              paddingRight: "6%",
            }}
          >
            <AdminPanel screenWidth={screenWidth}></AdminPanel>
          </div>
          <div
            className="h-100 p-4"
            style={{ flex:"1 0 0", backgroundColor: "white", borderRadius: "10px" }}
          >
            <Outlet></Outlet>
          </div>
        </div>
      </div>
              
      </div>
    </div>
  );
}
