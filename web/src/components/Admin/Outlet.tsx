import React from "react";
import plus from "../../assets/plus.svg";
import cross from "../../assets/crossRed.svg";
import { LoadingData } from "../Load";
import { Input } from "../tools/Input";
import { Modal } from "react-bootstrap";

interface AdminPageOutletProps {
  dop?: boolean;
  dopImg?: any;
  dopClick?: () => void;
  addName: string;
  addModal: React.ReactNode;
  fetchUrl: string;
  dataRender: (data: any) => string[];
  searchName: string;
  deleteEl: (data?: string) => void;
  reload: boolean;
  openAddModal: boolean;
  setOpenAddModal: (data: boolean) => void;
}

export function AdminPageOutlet(props: AdminPageOutletProps) {
  const {
    addName,
    fetchUrl,
    addModal,
    dataRender,
    deleteEl,
    reload,
    openAddModal,
    setOpenAddModal,
  } = props;
  const [deleteElement, setDeleteElement] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(1);
  const [data, setData] = React.useState({});

  const clickDelete = (element: any) => {
    setModalOpen(true);
    setDeleteElement(element);
  };

  React.useEffect(() => {
    const getData = async () => {
      try {
        setLoading(1);
        const baseUrl = `${window.location.protocol}//${window.location.host}/`;
        // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
        const data = await fetch(
          `http://localhost:3000${fetchUrl}/?search=${search}`
        );
        const jsonData = await data.json();
        setData(jsonData);
        setLoading(0);
      } catch (err) {
        setLoading(1);
        console.error(err);
      }
    };
    getData();
  }, [search, reload]);

  const renderData = () => {
    if (!loading) {
      return (
        <>
          {modalOpen && (
            <DeleteModal
              delete={() => {
                setModalOpen(false);
                deleteEl(deleteElement);
              }}
              closeModal={() => setModalOpen(false)}
            />
          )}
          {openAddModal && addModal}
          <div
            className="w-100 d-flex flex-column p-3"
            style={{ overflowY: "auto", gap: "10px" }}
          >
            {dataRender(data).map((element, index) => {
              return (
                <div
                  className="p-3 d-flex justify-content-between  align-items-center"
                  style={{
                    fontSize: "1.2rem",
                    borderRadius: "15px",
                    backgroundColor: "#e5e1d8",
                  }}
                >
                  <p>{element}</p>
                  <img
                    onClick={() => clickDelete(element)}
                    src={cross}
                    width={15}
                    height={15}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              );
            })}
          </div>
        </>
      );
    } else if (loading == -1) {
      return (
        <div
          className="h-100 w-100 d-flex align-items-center justify-content-center"
          style={{ fontSize: "1.5rem" }}
        >
          <p>Не удалось получить данные</p>
        </div>
      );
    } else {
      return (
        <div className="h-100 w-100 d-flex flex-align-center justify-content-center">
          <LoadingData />
        </div>
      );
    }
  };

  return (
    <div className="d-flex flex-column h-100" style={{ gap: "2%" }}>
      <div className="d-flex justify-content-between align-items-center">
        <Input
          setValue={setSearch}
          justify="start"
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            width: "35%",
            marginRight: "auto",
          }}
          placeholder={props.searchName}
        />
        <div
          className="d-flex align-items-center"
          style={{ gap: "10px", cursor: "pointer" }}
          onClick={() => setOpenAddModal(true)}
        >
          <img src={plus} width={20} height={20} />
          <div>Добавить {addName}</div>
        </div>
      </div>
      <div
        className="d-flex flex-column"
        style={{ gap: "5px", overflow: "auto", flex: 1 }}
      >
        {renderData()}
      </div>
    </div>
  );
}

export function AdminCabinets() {
  const [reload, setReload] = React.useState(false);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const cabinetDataRender = (data: { [P: string]: any }) => {
    let result: string[] = [];
    if ("all" in data) {
      result = data.all;
    }
    return result.sort();
  };

  const deleteCabinet = async (data: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/cabinet", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteCabinet: [data] }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении кабинета");
      }

      const result = await response.json();
      console.log("Результат удаления:", result);
      setReload(!reload);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <AdminPageOutlet
      addName="кабинет"
      dop={true}
      addModal={
        <AddModal
          fields={[{ field: "input", label: "Название", value: "newCabinet" }]}
          fetchUrl="/api/cabinet"
          setReload={() => setReload(!reload)}
          setOpenAddModal={setOpenAddModal}
          startState={{ newCabinet: "" }}
        />
      }
      openAddModal={openAddModal}
      setOpenAddModal={setOpenAddModal}
      fetchUrl="/api/cabinet"
      dataRender={cabinetDataRender}
      searchName="Поиск по кабинетам"
      deleteEl={deleteCabinet}
      reload={reload}
    />
  );
}

export function AdminDoctors() {
  const [reload, setReload] = React.useState(false);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const doctorDataRender = (data: { [P: string]: any }) => {
    let result: string[] = [];
    Object.values(data).forEach((element: any) => {
      if (element && Array.isArray(element)) {
        result = [...result, ...element];
      }
    });
    console.log(result.sort());
    return result;
  };

  const deleteDoctor = async (data: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/doctor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteDoctor: [data] }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении кабинета");
      }

      const result = await response.json();
      console.log("Результат удаления:", result);
      setReload(!reload);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <AdminPageOutlet
      addName="доктора"
      addModal={
        <AddModal
          fields={[
            { field: "input", label: "ФИО или название", value: "newDoctor" },
            { field: "directions", label: "Направление", value: "direction" },
          ]}
          startState={{
            newDoctor: "",
            direction: "additional",
          }}
          fetchUrl="/api/doctor"
          setReload={() => setReload(!reload)}
          setOpenAddModal={setOpenAddModal}
        />
      }
      openAddModal={openAddModal}
      setOpenAddModal={setOpenAddModal}
      fetchUrl="/api/doctor"
      dataRender={doctorDataRender}
      searchName="Поиск по врачам"
      deleteEl={deleteDoctor}
      reload={reload}
    />
  );
}

export function AdminQueue() {
  const [reload, setReload] = React.useState(false);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const queuerDataRender = (data: { [P: string]: any }) => {
    let result: string[] = [];
    if ("queues" in data) {
      result = data.queues;
    }
    return result.sort();
  };

  const deleteQueue = async (data: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/queue", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deleteQueue: [data] }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении кабинета");
      }

      const result = await response.json();
      console.log("Результат удаления:", result);
      setReload(!reload);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return (
    <AdminPageOutlet
      addName="очередь"
      addModal={
        <AddModal
          fields={[{ field: "input", label: "Название", value: "newQueue" }]}
          startState={{ newQueue: "" }}
          fetchUrl="/api/queue"
          setReload={() => setReload(!reload)}
          setOpenAddModal={setOpenAddModal}
        />
      }
      openAddModal={openAddModal}
      setOpenAddModal={setOpenAddModal}
      fetchUrl="/api/queue"
      dataRender={queuerDataRender}
      searchName="Поиск по очередям"
      deleteEl={deleteQueue}
      reload={reload}
    />
  );
}

interface DeleteModalProps {
  delete: () => void;
  closeModal: () => void;
}

function DeleteModal(props: DeleteModalProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center h-100 w-100"
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="p-2 d-flex justify-content-center align-items-center flex-column"
        style={{
          gap: "20%",
          width: "30%",
          height: "20%",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        <div>Вы точно хотите удалить элемент?</div>
        <div
          className="d-flex justify-content-center align-items-center w-100"
          style={{ gap: "20%" }}
        >
          <div
            className="p-2"
            onClick={props.delete}
            style={{
              color: "green",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Да
          </div>
          <div
            className="p-2"
            onClick={props.closeModal}
            style={{
              color: "red",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            Нет
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddModalProps {
  fields: Array<{ [P: string]: any }>;
  fetchUrl: string;
  setReload: () => void;
  setOpenAddModal: (data: boolean) => void;
  startState: { [P: string]: any };
}

function AddModal(props: AddModalProps) {
  const startState = props.startState ? props.startState : {};
  const [data, setData] = React.useState(startState);
  const [emptyEmptyErr, setEmptyEmptyErr] = React.useState(false);
  const { fields, fetchUrl, setReload, setOpenAddModal } = props;
  const [directions, setDirections] = React.useState([]);

  console.log(data);

  const add = async () => {
    setEmptyEmptyErr(false);
    let check = false;
    Object.values(data).forEach((element) => {
      if (!element) {
        check = true;
        return;
      }
    });

    if (check) {
      setEmptyEmptyErr(true);
      return;
    }

    setEmptyEmptyErr(false);

    try {
      const response = await fetch(`http://localhost:3000${fetchUrl}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении кабинета");
      }

      const result = await response.json();
      setReload();
      console.log("Результат удаления:", result);
    } catch (error) {
      console.error("Ошибка:", error);
    }

    setOpenAddModal(false);
  };

  const renderField = (field: string, label: string, value: string) => {
    const handleInputChange = (event: any) => {
      setEmptyEmptyErr(false);
      const newValue = event.target.value;
      setData((prev) => ({
        ...prev,
        [value]: newValue,
      }));
    };

    const getDirections = async () => {
      try {
        const baseUrl = `${window.location.protocol}//${window.location.host}/`;
        // const data = await fetch(`${baseUrl}${fetchUrl}/?search=${search}`);
        const data = await fetch(`http://localhost:3000/api/queue`);
        const jsonData = await data.json();
        if (jsonData.queues) {
          setDirections(jsonData.queues);
        }
      } catch (err) {
        console.error(err);
      }
    };

    React.useEffect(() => {
      getDirections();
    }, []);

    const handleSelectChange = (event: any) => {
      const newValue = event.target.value;
      setData((prev) => ({
        ...prev,
        [value]: newValue,
      }));
    };

    if (field == "input") {
      return (
        <div className="d-flex flex-column w-100">
          <div className="mb-2">{label}</div>
          <input
            onChange={handleInputChange}
            className="p-1"
            style={{ border: "1px solid grey", borderRadius: "5px" }}
          />
        </div>
      );
    } else if (field == "selectYesNo") {
      return (
        <div className="d-flex flex-column w-100" style={{ gap: "" }}>
          <div className="mb-2">{label}</div>
          <select
            id="decisionSelect"
            disabled
            onChange={handleSelectChange}
            className="p-1"
            style={{ border: "1px solid grey", borderRadius: "5px" }}
          >
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
      );
    } else if (field == "directions") {
      return (
        <div className="d-flex flex-column w-100" style={{ gap: "" }}>
          <div className="mb-2">{label}</div>
          <select
            onChange={handleSelectChange}
            className="p-1"
            style={{ border: "1px solid grey", borderRadius: "5px" }}
          >
            <option value="additional">Дополнительное направление</option>
            {directions.map((element) => {
              return <option value={element}>{element}</option>;
            })}
          </select>
        </div>
      );
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center h-100 w-100"
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="p-3 d-flex justify-content-center align-items-center flex-column"
        style={{
          gap: "22px",
          width: "30%",
          minHeight: "20%",
          backgroundColor: "white",
          borderRadius: "10px",
        }}
      >
        {emptyEmptyErr && (
          <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ color: "red" }}
          >
            Пожалуйста, запоните все поля формы
          </div>
        )}
        {fields.map((element) => {
          return renderField(element.field, element.label, element.value);
        })}
        <div className="d-flex justify-content-around align-items-center w-100">
          <div style={{ color: "green", cursor: "pointer" }} onClick={add}>
            Добавить
          </div>
          <div
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => setOpenAddModal(false)}
          >
            Назад
          </div>
        </div>
      </div>
    </div>
  );
}
