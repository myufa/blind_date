import React, { FC, useEffect, useRef, useState } from "react";
import { authClient, userClient } from "../../../services";
import './CreateUser.scss'
import '../../../styles/BDFormStyles/BDFormStyles.scss'
import { Link } from "react-router-dom";
import { updateFormValue } from "../../../utils/forms";
import { MultiSelect } from "../../../components/MultiSelect/MultiSelect";
import { AnonUserData } from "../../../lib/types";

export const CreateUser: FC = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ socials, setSocials ] = useState<number[]>([])
    const [genderPref, setGenderPref] = useState<number[]>([])
    const [gender, setGender] = useState(0)
    const [bio, setBio] = useState('')
    const [prompt1, setPrompt1] = useState('')
    const [prompt2, setPrompt2] = useState('')
    const [prompt3, setPrompt3] = useState('')
    const [prompt4, setPrompt4] = useState('')
    const [prompt5, setPrompt5] = useState('')
    const [age, setAge] = useState(0)
    const [profilePic, setProfilePic] = useState<File>()
    const [ instagram, setInstagram ] = useState(null)
    const [ snapchat, setSnapchat ] = useState(null)
    const [ facebook, setFacebook ] = useState(null)
    const [ phoneNumber, setPhoneNumber ] = useState(null)

    const genderOpts = [
        "Female",
        "Male",
        "Non-Binary"
    ]

    const socialsViewOpts = [
        "Insta",
        "Snap",
        "FB",
        "Phone",
    ]

    const socialSetters: ((v: any)=>void)[] = [
        setInstagram,
        setSnapchat,
        setFacebook,
        setPhoneNumber
    ]

    const genderSelectOpts = genderOpts.map((opt,i) => ({value: i, label: opt}))
    const socialSelectOpts = socialsViewOpts.map((opt,i) => ({value: i, label: opt}))

    const submitUser = async () => {
        const newUser: AnonUserData = {
            firstName, lastName, gender,
            email, password, genderPref,
            age, bio, prompt1, prompt2,
            prompt3, prompt4, prompt5,
            score:0,
            contacts: {instagram, snapchat, facebook, phoneNumber}
        }
        console.log(newUser)
        try{
            await authClient.createUser(newUser)
        } catch (err) {
            console.log('\n\nERROR AGHGJ1278ES', err, '\n\n')
            alert('Error, unable to create account with provided info')
            return
        }

        const profilePicResult = await userClient.uploadProfilePic(profilePic)

        window.open('/matcher/', '_self')
    }

    const renderSocial = (i: number) => {
        return (
            <label className='BD-Label' key={i}>
                {socialsViewOpts[i]}
                <input className='BD-Input' type={i==2 ? 'tel' : 'text'} onChange={updateFormValue(socialSetters[i])}></input>
            </label>
        )
    }

    const handleProfilePic = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        if(e.currentTarget.files){
            const file = e.currentTarget.files[0]
            setProfilePic(file)
            return(
                <div className='success-pic'>Yay! You did it!</div>
            )
        } 
    }

    return (
        <div className='create'>
            <head><link rel="stylesheet" href="https://use.typekit.net/six1nsj.css"></link></head>
            <form onSubmit={submitUser}>
                <div className="create-font">create your <br></br> blind date account</div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <h3>Already have an account? <br></br>
                    <Link className='PathLink' to='/Login/' >
                        Log In!
                    </Link>
                </h3>
                <label className='BD-Label'>
                    First Name
                    <input className='BD-Input' type='text' onChange={updateFormValue(setFirstName)}>
                    </input>
                </label>
                <br></br>
                <label className='BD-Label'>
                    Last Name
                    <input className='BD-Input' type='text' onChange={updateFormValue(setLastName)}>
                    </input>
                </label>
                <br></br>
                <label className='BD-Button mini'>
                    { profilePic ? 'Change Profile Photo' : 'Upload a Profile Photo'
                    }
                    <input type='file' onChange={handleProfilePic}>
                    </input>
                </label>
                <div>
                { profilePic ? 
                    <img 
                        className='profPicPreview'
                        src={URL.createObjectURL(profilePic)} 
                    />
                : null
                }
                </div>
                <br></br>
                <br></br>
                <label className='BD-Label'>
                    Email
                    <input 
                        className='BD-Input' 
                        type='email'
                        onChange={updateFormValue(setEmail)}>
                    </input>
                </label>
                <br></br>
                <label className='BD-Label'>
                    Password
                    <input 
                        className='BD-Input' 
                        type='password' 
                        autoComplete="new-password" 
                        onChange={updateFormValue(setPassword)}>
                    </input>
                </label>
                <br></br>
                <label className='BD-Label'>
                    How Old Are You?
                    <input className='BD-Input' type='text' onChange={updateFormValue(setAge)}>
                    </input>
                </label>
                <label className='BD-Label'>
                    Add your social media profiles! <br></br><br></br>
                    <MultiSelect 
                        opts={socialSelectOpts}
                        setter={setSocials}
                        nullify
                        nullifiers={socialSetters}
                    />
                </label>
                <div>{socials.sort().map(i=>renderSocial(i))}</div>
                <br></br>
                <label className='BD-Label'>
                    How do you identify?
                    <select name="gender" onChange={updateFormValue(setGender)}>
                        <option value="none" disabled hidden> 
                        Select an Option </option>
                        <option value={0}>Female</option>
                        <option value={1}>Male</option>
                        <option value={2}>Non-Binary</option>
                    </select>
                </label>
                <br></br>
                <br></br>
                <label className='BD-Label'>
                    Who do you prefer? (Select all that apply) <br></br><br></br>
                    <MultiSelect 
                        opts={genderSelectOpts}
                        setter={setGenderPref}
                    />
                </label>
                <br></br>
                <br></br>
                <label className='BD-Label'>
                   Tell us a bit about yourself
                   <textarea className='BD-Textarea' onChange={updateFormValue(setBio)}></textarea>
                </label>
                <br></br>
                <label className='BD-Label'>
                   My favorite hobby is...
                   <textarea className='BD-Textarea' onChange={updateFormValue(setPrompt1)}></textarea>
                </label>
                <br></br>
                <label className='BD-Label'>
                   Until recently, I had never...
                   <textarea className='BD-Textarea' onChange={updateFormValue(setPrompt2)}></textarea>
                </label>
                <br></br>
                <label className='BD-Label'>
                   If I could travel anywhere in the world...
                   <textarea className='BD-Textarea' onChange={updateFormValue(setPrompt3)}></textarea>
                </label>
                <br></br>
                <label className='BD-Label'>
                   I could eat this food every day...
                   <textarea className='BD-Textarea' onChange={updateFormValue(setPrompt4)}></textarea>
                </label>
                <br></br>
                <label className='BD-Label'>
                   When I grow up, I want to...
                   <textarea className='BD-Textarea' onChange={updateFormValue(setPrompt5)}></textarea>
                </label>
                <br></br>
            </form>
            <button className='BD-Button' onClick={submitUser}>
                Sign Up
            </button>
            <br></br>
            <br></br>
            <br></br>
        </div>
    )
}