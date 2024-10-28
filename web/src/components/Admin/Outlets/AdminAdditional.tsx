import React from "react";
import { AdminPageOutlet } from "../Outlet";
import { MAIN_URL } from "../../../utils";

export function AdminAdditionals() {
  const deleteElement = async (name: string) => {
    try {
      const response = await fetch(`${MAIN_URL}additional`, {
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
      deleteElement={(data: any) => deleteElement(data)}
      addName="направление"
      fetchUrl="additional/all"
      searchName="Поиск по направлениям"
      dataRender={(data) => {
        return data.map((element: any) => {
          return { title: element, forDelete: element };
        });
      }}
    />
  );
}
