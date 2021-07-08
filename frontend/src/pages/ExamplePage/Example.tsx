import React, { FC, useEffect, useRef, useState } from "react";
import { userClient } from "../../services";
import './Example.scss'

export const ExamplePage:FC<{param: string}> = (props) => {
    const [ helloString, setHelloString ] = useState('no data :(')
    const [ loading, setLoading ] = useState(true)
    const getData = () => {
        userClient.getHello()
        .then(data => {
            setHelloString(data)
            setLoading(false)
        })
    }
    useEffect(getData, [])
    return (
        <div className="ExampleSubPage">
            { loading ?
                <div>
                    loading...
                </div>
            :
                <div>
                    Example Prop: {props.param} {helloString}
                </div>                
            }
        </div>
    )
}