import React, { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { authClient } from "../../../services";
import { updateFormValue } from "../../../utils/forms";
import './LoginUser.scss';


export const LoginUser: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitLogin = async () => {
        let user: any = {} 
        try {
            user = await authClient.login({
                email,
                password
            })
        } catch (err) {
            console.log('\n\nERROR AGHGJ1278ES', err, '\n\n')
            alert('Error, unable to login with provided info')
            return
        }
        window.open('/matcher/', "_self")
    }

    const keyboardSubmit = async (e: any) => {if (e.keyCode===13) {await submitLogin()}}

    return (
        <div className='login'>
            <head><link rel="stylesheet" href="https://use.typekit.net/six1nsj.css"></link></head>
            <form onSubmit={submitLogin}>
                <h2 className="logo-font">log in to blind date</h2>
                <label className='BD-Label'>
                    Email
                    <input 
                        className='BD-Input'
                        type='email'
                        onChange={updateFormValue(setEmail)} 
                        onKeyUp={keyboardSubmit}>
                    </input>
                </label>
                <label>
                    <br></br><br></br>
                    Password
                    <input 
                        className='BD-Input'
                        type='password' 
                        onChange={updateFormValue(setPassword)} 
                        onKeyUp={keyboardSubmit}>
                    </input>
                </label>
            </form>
            <button 
                className='BD-Button'
                onClick={submitLogin}
            >
                Login
            </button>
            <h3>Don't have an account yet? <br></br>
              <Link className='PathLink' to='/Create-User/' >
                Create an Account!
              </Link>
            </h3>
        </div>
    )
}