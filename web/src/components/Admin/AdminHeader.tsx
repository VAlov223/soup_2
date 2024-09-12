import React from 'react'
import leave from "../../assets/leave.svg"
import admin from "../../assets/admin.svg"

interface AdminHeaderProps { 
    screenWidth: number
} 

export function AdminHeader(props: AdminHeaderProps) { 
    return( 
        <div className='p-3' style={{backgroundColor: "white"}}> 
        <div className="d-flex justify-content-between align-items-center" style={{maxWidth: "1300px", width: "100%",  margin: "0 auto"}}>    
        <div>
            <p style={{fontSize: "1rem"}}>
                Администрирование системы<br/>управления потоком пациетнов
            </p>
        </div>

        <div>
            <div className='d-flex justify-content-right align-items-center' style={{gap: "20px"}}> 
                <div  className='d-flex align-items-center' style={{gap: "10px"}}>
            <img src={admin} width={30} height={30}/>
                <p style={{fontSize: "1rem", whiteSpace: "nowrap"}}>Викторов Андрей</p>
                </div>
            <img src={leave} width={20} height={20} style={{cursor: "pointer"}}/>
            </div>
        </div>
        </div>
        </div>
    )
}