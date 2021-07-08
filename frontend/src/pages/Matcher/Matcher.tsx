import React, { FC, useEffect, useRef, useState } from "react";
import Popup from 'reactjs-popup';
import { matchClient, userClient } from "../../services";
import { UserData, DisplayData } from "../../lib/types";
import "./Matcher.scss"
import "../../styles/BDFormStyles/BDFormStyles.scss"

export const Matcher: FC<{setPage: (v: number)=>void}> = ({setPage}) => {
    const [open, setOpen] = useState(false);
    const closeModal = () => {
      setOpen(false)
      $(document).ready(function() {
        $("#disable").prop('disabled', false);
      });
    };
    const [potentialMatches, setPotentialMatches] = useState<UserData[]>([])
    const [submittedMatch, setSubmittedMatch] = useState<number[]>([])
    const [selectedUser, setSelectedUser] = useState<any>({})

    const getPotentials = () => {
        matchClient.getPotentials()
        .then((potentialMatches) => {
          console.log(potentialMatches)
          setPotentialMatches(potentialMatches)
        })
    }

    const submitMatch = async () => {
        const message = 'Congrats! You have made a match!'
        //alert(message)
        console.log(message)
        const match = await matchClient.submitMatch(
            potentialMatches[submittedMatch[0]].id,
            potentialMatches[submittedMatch[1]].id
        )
        
        const newMatches = await matchClient.refreshPotentials(
          potentialMatches.map(m=>m.id), 2
        )
        console.log(
          'oldMatches: ', 
          potentialMatches[submittedMatch[0]].firstName, 
          potentialMatches[submittedMatch[1]].firstName,
          submittedMatch
        )
        console.log('newMatches: ', newMatches.map(m=>m.firstName), submittedMatch)
        const newPotentialMatches = [...potentialMatches]
        submittedMatch.map((oldI, i) => newPotentialMatches.splice(oldI, 1, newMatches[i]))
        setPotentialMatches(newPotentialMatches)
        setSubmittedMatch([])
    }

    const refreshAllPotentials = async () => {
      const newMatches = await matchClient.refreshPotentials(
        potentialMatches.map((m, i)=> m.id), 8
      )
      setSubmittedMatch([])
      setPotentialMatches(newMatches)
    }

    useEffect(()=>{
      setPage(1)
      getPotentials()
    }, [])

    const onUserExpand = (i: number) => {
      return (e: React.MouseEvent<any>) => {
        e.stopPropagation()
        setSelectedUser(potentialMatches[i])
        setOpen(!open)
      }
    }

    const updateSubmittedMatch = (e: React.MouseEvent<any>, i: number) => {
      console.log('pressed', i, potentialMatches[i].firstName)
      e.stopPropagation()
      if (submittedMatch.indexOf(i) === -1) {
        if (submittedMatch.length >= 2) return
        submittedMatch.push(i)
        setSubmittedMatch([...submittedMatch])
      } else {
        const index = submittedMatch.indexOf(i);
        if (index > -1) {
          submittedMatch.splice(index, 1);
        }
        setSubmittedMatch([...submittedMatch])
      }
      console.log(submittedMatch)
    }
    const renderP1 = (user: any) => {
      if (user.prompt1) return(<div className='pop-prompt'>My favorite hobby is <b className='pop-prompt-emph'>{user.prompt1}</b><br></br><br></br></div>)
      return('')
    }
    const renderP2 = (user: any) => {
      if (user.prompt2) return(<div className='pop-prompt'>Until recently, I had never <b className='pop-prompt-emph'>{user.prompt2}</b><br></br><br></br></div>)
      return('')
    }
    const renderP3 = (user: any) => {
      if (user.prompt3) return(<div className='pop-prompt'>If I could travel anywhere in the world <b className='pop-prompt-emph'>{user.prompt3}</b><br></br><br></br></div>)
      return('')
    }
    const renderP4 = (user: any) => {
      if (user.prompt4) return(<div className='pop-prompt'>I could eat <b className='pop-prompt-emph'>{user.prompt4}</b> every day<br></br><br></br></div>)
      return('')
    }
    const renderP5 = (user: any) => {
      if (user.prompt5) return(<div className='pop-prompt'>When I grow up, I want to <b className='pop-prompt-emph'>{user.prompt5}<br></br></b><br></br></div>)
      return('')
    }
    const renderPrompts = (user: any) => {
      return(
        <div>
          {renderP1(user)}
          {renderP2(user)}
          {renderP3(user)}
          {renderP4(user)}
          {renderP5(user)}
        </div>
      )
    }

    const renderBioPop = (i: number) => {
      const user = selectedUser
      return (
        <div>
          <span className='pop-name'>{user.firstName}</span>
          <br></br>
          {user.profilePicUrl ?
            <img src={user.profilePicUrl} alt="profile picture" className="pop-img"/>
            : <div><br></br><br></br></div>
          }
          <br></br>
          <div><span className='pop-bio'>{user.age} years old | {user.bio}</span><br></br><br></br></div>
          <div><br></br>{renderPrompts(user)}</div>
        </div>
      )
    }
    
    const renderUsers = () => {
      return potentialMatches.slice(0,8).map((user, i) => {
        return (
          <div key={i} className="checks">
            <label>
            <button type="button" className="tiles" onClick={(e)=>updateSubmittedMatch(e, i)} id={submittedMatch.indexOf(i) !==-1 ? 'pressed' : 'unpressed' }>
              <span>{user.firstName}</span>
              <br></br>
              {user.profilePicUrl ?
              <img src={user.profilePicUrl} alt="profile picture" className="tileImg"/> 
              : <div><br></br><br></br></div>
              }
              <br></br>
              <div className="bio-text">{user.bio}</div>
              <div className='tile-learn-more' onClick={onUserExpand(i)}>learn more</div>
            </button>
             <Popup open={open} closeOnDocumentClick onClose={closeModal}>
               <div id="pop">{renderBioPop(i)}
                <button onClick={closeModal} className='pop-close'>Back to Matching</button>
               </div>
             </Popup>
            </label>
          </div>   
        )
      })
    }

  return (
    <div id="page">
      <head><link rel="stylesheet" href="https://use.typekit.net/six1nsj.css"></link></head>
      
      <div className='header-font'>
        blind date
      </div>
      <br></br><br></br><br></br><br></br><br></br>
      <div>
        <form className="container">
          {renderUsers()}
        </form>
      </div>
      <button onClick={submitMatch} className="submit-buttons">Make Match</button>
      <button onClick={refreshAllPotentials} className="submit-buttons">Refresh Feed</button>
      <br></br><br></br><br></br><br></br><br></br>
    </div>
  )
}
