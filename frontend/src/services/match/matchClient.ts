import axios, { AxiosResponse, CancelTokenStatic, Method, AxiosRequestConfig } from "axios";
import { UserData, DisplayData, AnonUserData, MatchModel } from '../../lib/types'
import { BaseClient } from "../baseClient";

export class MatchClient extends BaseClient {

    constructor() {
        super('matches/')
    }

    async getPotentials(): Promise<UserData[]> {
        const result = await this.callApp('get-potential-matches', 'get')
        console.log('\n\npotentials', result.data, '\n\n')
        const potentials: UserData[] = result.data.potentialMatches
        return potentials
    }

    async refreshPotentials(oldMatches: string[], numFetch: number): Promise<UserData[]> {
        const result = await this.callApp('get-new-matches', 'post', {oldMatches, numFetch})
        console.log('\n\npotentials', result.data, '\n\n')
        const potentials: UserData[] = result.data.potentialMatches
        return potentials
    }

    async submitMatch(user1Id: string, user2Id: string): Promise<UserData> {
        const userId = localStorage.getItem('userId')
        if (!userId) throw new Error('not loggied in')
        console.log('localStorage: ', localStorage)
        console.log('userId: ', userId)
        const match: MatchModel = {
            user1: {userId: user1Id, response: 'pending'},
            user2: {userId: user2Id, response: 'pending'},
            matchers: [userId]
        }
        const result = await this.callApp('submit-match', 'post', match) 
        return result.data
    }

    async respondToMatch(matchId: string, response: 'accept' | 'reject') {
        const matchResponseData = {
            matchId,
            response
        }
        console.log('matchResponseData: ', matchResponseData)
        const result = await this.callApp('respond-to-match', 'post', matchResponseData)
        return result.data
    }

 }

export const matchClient = new MatchClient()
