import axios, { AxiosResponse, CancelTokenStatic, Method, AxiosRequestConfig } from "axios";
import { UserData, DisplayData, AnonUserData } from '../../lib/types'
import { BaseClient } from "../baseClient";


export class AuthClient extends BaseClient {

    constructor() {
        super('auth/')
    }

    async createUser(newUser: AnonUserData): Promise<UserData> {
        console.log('\n\nnew user: ', newUser, '\n\n')
        let result: any = {} 
        try {
            result = await this.callApp('create-account', 'post', newUser)
        } catch (err) {
            throw new Error(err)
        }
        localStorage.setItem("token", result.data.access_token)
        localStorage.setItem("token_type", result.data.token_type)
        localStorage.setItem("userId", result.data.userId)

        return result.data
    }


    async login(existingUser: {email: string; password: string}): Promise<UserData> {
        const form = new FormData
        form.append('username', existingUser.email)
        form.append('password', existingUser.password)
        const result: any = await this.callApp(
            "login", 
            'post', 
            form, 
            //{"content-type": "application/x-www-form-urlencoded"}, 
            //{'accept': 'application/json'}
        )
        console.log('\n\ncreds', existingUser, '\n\n')
        localStorage.setItem("token", result.data.access_token)
        localStorage.setItem("token_type", result.data.token_type)
        console.log('login data: ', result.data)
        localStorage.setItem("userId", result.data.userId)
        return result.data
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        window.open('/login', '_self')
    }   

    async isLoggedIn(): Promise<boolean> {
        try {
            const result = await this.callApp('is-authenticated', 'get')
            console.log('stat check: ', result.status)
            return result.status === 200
        } catch (err) {
            return false
        }
    }
 }

export const authClient = new AuthClient()
