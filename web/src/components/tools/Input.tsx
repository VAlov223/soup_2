import React from "react";
import search from "../../assets/search.svg";

interface InputProps {
  setValue: (value: any) => void;
  style?: { [P: string]: any };
  justify?: string
  placeholder?: string;
}

export function Input(props: InputProps) {
  const { setValue } = props;
  const stlye = props.style
    ? props.style
    : {
        backgroundColor: "white",
        borderRadius: "20px",
        width: "35%",
        marginLeft: "auto",
        marginRight: "auto",
      };
  const justify = props.justify ? props.justify : "center"
  const timeout = React.useRef<any>(null);
  const placeholder = props.placeholder ? props.placeholder : "поиск по сотрудникам"

  function debounce(value: any, time: number) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      console.log(10);
      setValue(value);
    }, time);
  }

  return (
    <div className={`d-flex justify-content-${justify} mb-3 mt-3 p-2`} style={stlye}>
      <img src={search} height={30} width={30} />
      <input
        type="text"
        className=""
        placeholder={placeholder}
        style={{ textAlign: "center" }}
        width="100%"
        onChange={(event: any) => debounce(event.target.value, 1000)}
      />
    </div>
  );
}
