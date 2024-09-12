import React from "react";

export function Auth() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");

  const go = () => {};

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100 w-100 overflow-hidden" style={{backgroundColor: "rgb(248, 248, 255)"}}>
    <div className="mb-3" style={{textAlign: "center", fontSize: "1.2rem"}}>
        Вход в администрирование СУПП
    </div>
      <div className="p-5 d-flex flex-column justify-content-center align-items-center" style={{backgroundColor: "white", gap: "20px"}}>
        <div className="w-100">
            <div className="mb-3">
                Логин<span style={{color: "red"}}>*</span>
            </div>
            <input placeholder="Логин" className="p-1 w-100" style={{border: "1px solid grey", borderRadius: "3px"}}/> 
        </div>
        <div className="w-100">
            <div className="mb-3">
                Пароль<span style={{color: "red"}}>*</span>
            </div>
            <input placeholder="Пароль" className="p-1 w-100" style={{border: "1px solid grey", borderRadius: "3px"}}/> 
        </div>
        <div className="mt-2" style={{textAlign: "center", color: "green", fontSize: "1.1rem"}}>
            Войти
        </div>
      </div>
    </div>
  );
}
