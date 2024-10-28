import React from "react";
import { AdminPageOutlet } from "../Outlet";
import { MAIN_URL } from "../../../utils";

export function AdminDoctors() {
  const deleteElement = async (element: any) => {
    try {
      console.log(element);
      const response = await fetch(`${MAIN_URL}doctor/${element}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
      deleteElement={(element: any) => deleteElement(element)}
      addName="доктора"
      fetchUrl="doctor"
      searchName="Поиск по врачам"
      dataRender={(data) => {
        return data.map((element: any) => {
          return {
            title: `${element.name} - ${element.profile}`,
            forDelete: element.personalId,
          };
        });
      }}
    />
  );
}
