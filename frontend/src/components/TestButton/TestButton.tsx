import React, { FC, useEffect, useRef, useState } from "react";
import { Method } from "axios";
import { userClient } from '../../services'
import './TestButton.scss'

export const TestButton:FC<{name: string, callback: ()=>any}> = (props) => {
    const callTest = () => {
        props.callback()
        .then((data: any)=>console.log(data))
        .catch((err: any)=>console.log(err))
    }
    return (
        <button className='TestButton' onClick={callTest}>
            {props.name}
        </button>
    )
}