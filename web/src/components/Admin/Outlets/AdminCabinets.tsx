import React from "react";
import { AdminPageOutlet } from "../Outlet";
import { MAIN_URL } from "../../../utils";

export function AdminCabinets() {
  const deleteElement = async (name: string) => {
    try {
      const response = await fetch(`${MAIN_URL}cabinet`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Cabinet deleted:", result);
    } catch (error) {
      console.error("Error deleting cabinet:", error);
    }
  };

  return (
    <AdminPageOutlet
      addName="кабинет"
      fetchUrl="cabinet/all"
      searchName="Поиск по кабинетам"
      dataRender={(data) => {
        return data.map((element: any) => {
          return { title: element, forDelete: element };
        });
      }}
      deleteElement={(name: string) => deleteElement(name)}
    />
  );
}
