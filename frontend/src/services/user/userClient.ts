import axios, { AxiosResponse, CancelTokenStatic, Method, AxiosRequestConfig } from "axios";
import { UserData, DisplayData, AnonUserData, MyMatchUserData, UpdateUserData } from '../../lib/types'
import { BaseClient } from "../baseClient";


export class UserClient extends BaseClient {

    constructor() {
        super('user/')
    }

    async getHello(): Promise<string> {
        const result = await this.callApp('example/hello', 'get')
        return result.data.message
    }

    async loadUserMatches(): Promise<MyMatchUserData[]> {
        const result = await this.callApp('my-matches', 'get')
        console.log('\n\nmy matches: ', result.data, '\n\n')
        const matches: MyMatchUserData[] = result.data
        return matches
    }

    async getCurrentUser() : Promise<UserData> {
        const currentUserRaw = await this.callApp("me", 'get')
        const currentUser: UserData = currentUserRaw.data
        
        return currentUser
    }    

    async updateUser(newUser: UpdateUserData): Promise<UserData> {
        let result: any = {} 
        console.log('new user log', newUser)
        try {
            result = await this.callApp('update-user', 'post', newUser)
        } catch (err) {
            throw new Error(err)
        }
        return result.data
    }

    async uploadProfilePic(profilePic: File | undefined) {
        if(!profilePic) return 'fucked up'
        const form = new FormData()
        form.append('imageFile', profilePic)
        const result: any = await this.callApp(
            "upload-profile-pic", 
            'post', 
            form,
            {'Content-Type': 'multipart/form-data', 'accept': 'application/json'}
        )
        const profilePicUrl = result.data.profilePicUrl
        return profilePicUrl
    }

 }

export const userClient = new UserClient()
