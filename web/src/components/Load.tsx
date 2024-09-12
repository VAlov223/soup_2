import React from "react";
import loading from "../assets/loadData.gif"


export function LoadingData() { 
    return ( 
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
            <img src={loading} height={50} width={50}/>
        </div>
    )
}