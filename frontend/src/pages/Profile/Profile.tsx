import React, { FC, useEffect, useRef, useState } from "react";
import { authClient, userClient } from "../../services";
import { UserData, UpdateUserData } from "../../lib/types";
import Popup from 'reactjs-popup';
import { updateFormValue, updateMultiSelect } from "../../utils/forms";
import { MultiSelect } from "../../components/MultiSelect";
import "./Profile.scss"

export const UserProfile : FC<{setPage: (v: number)=>void}> = ({setPage}) => {
    const [currentUser, setUser] = useState<UserData>()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState<string | null>(null)
    const [genderPref, setGenderPref] = useState<number[]>([])
    const [gender, setGender] = useState([0])
    const [bio, setBio] = useState('')
    const [prompt1, setPrompt1] = useState('')
    const [prompt2, setPrompt2] = useState('')
    const [prompt3, setPrompt3] = useState('')
    const [prompt4, setPrompt4] = useState('')
    const [prompt5, setPrompt5] = useState('')
    const [age, setAge] = useState(0)
    const [profilePic, setProfilePic] = useState<File>()
    // contacts
    const [ socials, setSocials ] = useState<number[]>([])
    const [ instagram, setInstagram ] = useState(null)
    const [ snapchat, setSnapchat ] = useState(null)
    const [ facebook, setFacebook ] = useState(null)
    const [ phoneNumber, setPhoneNumber ] = useState(null)
    
    const [showEdit, setShowEdit] = useState(false)
    
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

    const renderSocial = (i: number) => {
        return (
            <label className='BD-Label' key={i}>
                {socialsViewOpts[i]}
                <input className='BD-Input' type={i==2 ? 'tel' : 'text'} onChange={updateFormValue(socialSetters[i])}>
                </input>
            </label>
        )
    }

    const loadProfile = () => {
        userClient.getCurrentUser()
        .then((currentUser) => {
            setUser(currentUser)
            setFirstName(currentUser.firstName)
            setLastName(currentUser.lastName)
            setEmail(currentUser.email)
            setGenderPref(currentUser.genderPref)
            setGender(currentUser.gender)
            setBio(currentUser.bio)
            setPrompt1(currentUser.prompt1)
            setPrompt2(currentUser.prompt2)
            setPrompt3(currentUser.prompt3)
            setPrompt4(currentUser.prompt4)
            setPrompt5(currentUser.prompt5)
            setAge(currentUser.age)
            console.log(currentUser)
        })
    }
    useEffect(() => {
        setPage(2)
        loadProfile()
    }, [])

    const submitUser = async () => {
        let user: any = {}
        try{
            if(currentUser) {
                user = await userClient.updateUser({
                    firstName, lastName, email, gender, genderPref, password,
                    age, bio, prompt1, prompt2, prompt3, prompt4, prompt5,
                    contacts: {instagram, snapchat, facebook, phoneNumber}
                })
            }
        } catch (err) {
            console.log('\n\nERROR AGHGJ1278ES', err, '\n\n')
            alert('Error, unable to create account with provided info')
            return
        }
        const profilePicResult = await userClient.uploadProfilePic(profilePic)
        setShowEdit(false)
        loadProfile()

    }

    const handleProfilePic = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        if(e.currentTarget.files){
            const file = e.currentTarget.files[0]
            setProfilePic(file)
            console.log("prof pic", profilePic?.name)
        } 
    }


    const logout = async () => {
        let user: any = {} 
        authClient.logout()
        window.open('/login', "_self")
    }
    const editProfile = async () => {
        setShowEdit(true)
    }
    const cancel = async () => {
        setShowEdit(false)
        loadProfile()
    }
   
    const renderP1 = () => {
        if(currentUser) {
            if (currentUser.prompt1) return(<div className='pop-prompt'>My favorite hobby is <b className='pop-prompt-emph'>{currentUser.prompt1}</b><br></br><br></br></div>)
        }
        return('')
    }
    const renderP2 = () => {
        if(currentUser) {
            if (currentUser.prompt2) return(<div className='pop-prompt'>Until recently, I had never <b className='pop-prompt-emph'>{currentUser.prompt2}</b><br></br><br></br></div>)
        }
        return('')
    }
    const renderP3 = () => {
        if(currentUser) {
            if (currentUser.prompt3) return(<div className='pop-prompt'>If I could travel anywhere in the world <b className='pop-prompt-emph'>{currentUser.prompt3}</b><br></br><br></br></div>)
        }
        return('')
    }
    const renderP4 = () => {
        if (currentUser) {
            if (currentUser.prompt4) return(<div className='pop-prompt'>I could eat <b className='pop-prompt-emph'>{currentUser.prompt4}</b> every day<br></br><br></br></div>)
        }
        return('')
    }
    const renderP5 = () => {
        if(currentUser) {
            if (currentUser.prompt5) return(<div className='pop-prompt'>When I grow up, I want to <b className='pop-prompt-emph'>{currentUser.prompt5}<br></br></b><br></br></div>)
        }
        return('')
    }
    const renderPrompts = () => {
        return(
          <div>
            {renderP1()}
            {renderP2()}
            {renderP3()}
            {renderP4()}
            {renderP5()}
          </div>
        )
    }

    const renderUserInfo = () => {
        if(currentUser && !showEdit) {
            return(
                <div className='prof-page'>
                    <div className='prof-name'>{currentUser.firstName}</div>
                    <div >
                        <div className='edit-button' onClick={editProfile}>
                            <img  
                                src={userClient.baseUrl+'static/edit.png'} 
                                alt="Edit Profile"
                                className='edit-icon'
                            />
                        </div>
                    </div>
                    <div className='pop-bio'>{currentUser.email}</div>
                    <span className='pop-bio'><b className='pop-prompt-emph'>Matchmaker Score: </b>{currentUser.score}</span>
                    <Popup trigger={open => (<button className="helpButton">?</button>)} position="left center" closeOnDocumentClick>
                        <div className="pop-help">Your matchmaker score increases every time both parties in the match you make accept their match. The higher your score, the more you will show up for other users to match you. In short, <b>the more you match, the more matches you get!</b></div>
                    </Popup>
                    <br></br>
                    
                    {currentUser.profilePicUrl ? 
                        <img src={currentUser.profilePicUrl} alt="profile picture" className="prof-img"/>
                        : <div><br></br><br></br></div>
                    }
                    <br></br>
                    <div><span className='pop-bio'>{currentUser.age} years old | {currentUser.bio}</span><br></br><br></br></div>
                    <div><br></br>{renderPrompts()}</div>
                    <div>
                        <button className='logout-button' onClick={logout}>
                            logout
                        </button>
                    </div>
                   
                    
                </div>   
            )
        }
        
    }

    const renderFormEdit = () => {
        if(currentUser && showEdit) {
            return(
            <div className='create'>
                <form onSubmit={submitUser}>
                    <div className="create-font">Edit your <br></br> blind date account</div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <label className='BD-Label'>
                        First Name
                        <input className='BD-Input' type='text' placeholder={firstName} onChange={updateFormValue(setFirstName)}>
                        </input>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                        Last Name
                        <input className='BD-Input' type='text' placeholder={lastName} onChange={updateFormValue(setLastName)}>
                        </input>
                    </label>

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
                            alt="profile picture"
                        />
                    : null
                    }
                    </div>
                    <br></br>
                    <br></br>

                    <label className='BD-Label'>
                        Email
                        <input className='BD-Input' type='text' placeholder={email} onChange={updateFormValue(setEmail)}>
                        </input>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                        Password
                        <input className='BD-Input' type='password'  onChange={updateFormValue(setPassword)}>
                        </input>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                        How Old Are You?
                        <input className='BD-Input' type='text' placeholder={String(age)} onChange={updateFormValue(setAge)}>
                        </input>
                    </label>
                    <label className='BD-Label'>
                        Add your social media profiles!
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
                        Who do you prefer?
                        <MultiSelect 
                            opts={genderSelectOpts}
                            setter={setGenderPref}
                        />
                    </label>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <label className='BD-Label'>
                    Tell us a bit about yourself
                    <textarea className='BD-Textarea' placeholder={bio} onChange={updateFormValue(setBio)}></textarea>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                    My favorite hobby is...
                    <textarea className='BD-Textarea' placeholder={prompt1} onChange={updateFormValue(setPrompt1)}></textarea>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                    Until recently, I had never...
                    <textarea className='BD-Textarea' placeholder={prompt2} onChange={updateFormValue(setPrompt2)}></textarea>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                    If I could travel anywhere in the world...
                    <textarea className='BD-Textarea' placeholder={prompt3} onChange={updateFormValue(setPrompt3)}></textarea>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                    I could eat this food every day...
                    <textarea className='BD-Textarea' placeholder={prompt4} onChange={updateFormValue(setPrompt4)}></textarea>
                    </label>
                    <br></br>
                    <label className='BD-Label'>
                    When I grow up, I want to...
                    <textarea className='BD-Textarea' placeholder={prompt5} onChange={updateFormValue(setPrompt5)}></textarea>
                    </label>
                    <br></br>
                </form>
                <button className='submit-buttons' onClick={submitUser}>
                    Update User
                </button>
                <button className='submit-buttons' onClick={cancel}>
                    Cancel
                </button>
                <br></br>
                <br></br>
                <br></br>
            </div>
            )
        }
    }
      
    return(
        <div>
            <head><link rel="stylesheet" href="https://use.typekit.net/six1nsj.css"></link></head>
            {renderUserInfo()}
            {renderFormEdit()}
        </div>        
)

}