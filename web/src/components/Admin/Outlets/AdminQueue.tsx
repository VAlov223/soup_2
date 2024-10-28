import React from "react";
import { AdminPageOutlet } from "../Outlet";
import { MAIN_URL } from "../../../utils";

export function AdminQueue() {
  const deleteElement = async (name: string) => {
    console.log(name);
    try {
      const response = await fetch(`${MAIN_URL}queue`, {
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
      deleteElement={(element: any) => deleteElement(element)}
      addName="очередь"
      fetchUrl="queue"
      searchName="Поиск по очередям"
      dataRender={(data) => {
        return data.map((element: any) => {
          return { title: element.name, forDelete: element.name };
        });
      }}
    />
  );
}
