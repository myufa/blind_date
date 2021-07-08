import axios, { Method } from "axios";
import * as stageData from '../../project-metadata.json'

export abstract class BaseClient {
    //static baseUrl = 'https://blind-date-dev-304521.ue.r.appspot.com/'
    baseUrl: string = 'http://127.0.0.1:8080/'
    static CancelToken = axios.CancelToken
    static isCancel = axios.isCancel

    route: string

    constructor(route: string) {
        this.route = route
        if (stageData.stage === 'prod') {
            console.log('shit it works')
            this.baseUrl = 'https://blind-date-dev-304521.ue.r.appspot.com/'
        } 
        console.log('what stage?', stageData.stage, stageData)
    }

    async callApp(path: string, method: Method , data?: any, params?: any, headers: any = {}, options?: any) {
        const token = localStorage.getItem('token')
        console.log(token)
        const token_type = localStorage.getItem('token_type')
        console.log(token_type)
        var headers_str = ''

        if(token && token_type) {
            headers_str = token_type + ' ' + token
            headers['Authorization'] = headers_str
            console.log('\n\nheaders', headers)
        }
        
        const result = await axios({
            withCredentials: true,
            url: this.baseUrl + this.route + path,
            method: method,
            data: data,
            params: params,
            headers: { ...headers },
            ...options
        })
        return result
    }
}
