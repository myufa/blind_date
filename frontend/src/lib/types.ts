

export interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: number[];
    password: string;
    genderPref: number[];
    age: number;
    bio: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    prompt5: string;
    profilePicUrl?: string;
    score: number;
    scoredMatches: string[];
    contacts?: SocialData;
}

export interface MyMatchUserData extends UserData {
    numMatchers: number;
    response: 'pending' | 'accept' | 'reject';
    myResponse: 'pending' | 'accept' | 'reject';
    contacts?: SocialData;
}

export interface AnonUserData {
    firstName: string;
    lastName: string;
    email: string;
    gender: number;
    password: string;
    genderPref: number[];
    age: number;
    bio: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    prompt5: string;
    photo?: string;
    score: number;
    contacts?: SocialData;
}

export interface DisplayData {
    potentialMatches: UserData[];
    currentUser?: UserData;
    maxPotentialMatches: number;
}

export interface MatchModel{
    id?: string
    user1: MatcheeModel;
    user2: MatcheeModel;
    matchers: string[];
}

export interface MatcheeModel {
    userId: string;
    response: 'pending' | 'accept' | 'reject'
}

export interface SocialData {
    'instagram': string | null;
    'snapchat': string | null;
    'facebook': string | null;
    'phoneNumber': string | null;
}

export interface UpdateUserData {
    firstName: string;
    lastName: string;
    email: string;
    gender: number[];
    password: string | null;
    genderPref: number[];
    age: number;
    bio: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    prompt5: string;
    contacts?: SocialData;
}
