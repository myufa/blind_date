import React, { FC, useEffect, useRef, useState } from "react";
import Popup from 'reactjs-popup';
import { MyMatchUserData, UserData } from "../../lib/types";
import { matchClient, userClient } from "../../services";

import './MyMatches.scss'

const hasContacts = (contacts: any): boolean => {
  if (!contacts) return false 
  for (const key of Object.keys(contacts)) {
    if (contacts[key]) return true
  }
  return false
}

export const MyMatchesPage: FC<{setPage: (v: number)=>void}> = ({setPage}) => {
    const [loading, setLoading] = useState(true)
    const [matches, setMatches] = useState<MyMatchUserData[]>([])
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);
    const [selectedUser, setSelectedUser] = useState<any>({})


    const loadMatches =async () => {
        userClient.loadUserMatches()
        .then(matches => {
          setMatches(matches)
        })
    }

    const onUserExpand = (i: number) => {
        return () => {
          setSelectedUser(matches[i])
          setOpen(!open)
        }
    }

    const acceptMatchHandler = (matchId: string, index: number) => {
      return async () => {
        await matchClient.respondToMatch(matchId, 'accept')
        const matchesUpdate = [...matches]
        matchesUpdate[index].myResponse = 'accept'
        setMatches(matchesUpdate)
      }
    }

    const rejectMatchHandler = (matchId: string, index: number) => {
      return async () => {
        await matchClient.respondToMatch(matchId, 'reject')
        const matchesUpdate = [...matches]
        matchesUpdate.splice(index, 1)
        setMatches(matchesUpdate)
      }
    }

    useEffect(()=>{
      setPage(0)
      loadMatches().then(()=>setLoading(false))
      
    }, [])

    const renderPrompts = (user: any) => {
      const prompts = [
        'My favorite hobby is',
        'Until recently, I had never',
        'If I could travel anywhere in the world',
        'I could eat this every day',
        'When I grow up, I want to'
      ]
      return(
        <div>
          {prompts.map((prompt, i) => {
            return user[`prompt${i+1}`] ? 
              <div className='pop-prompt'>
                {prompts[i]} 
                <br></br>
                <b className='pop-prompt-emph'>
                  {user[`prompt${i+1}`]}
                </b>
                <br></br><br></br>
              </div>
            : null
          })}
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
            <div><div className='pop-bio'>{user.age} years old | {user.bio}</div></div>
            <div><br></br>{renderPrompts(user)}</div>
          </div>
        )
    }

    const renderSocial = (user: MyMatchUserData) => {
      return user.contacts && hasContacts(user.contacts) ? 
        (
          <div className="match-contacts">
            {user.contacts.instagram ?
              <div className='sm-link'>
                <a 
                  href={`https://instagram.com/${user.contacts.instagram}`}
                  target="_"
                >
                  <img 
                    className="ig-icon"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png" 
                    alt={`https://instagram.com/${user.contacts.instagram}`}/>
                </a>
                </div>
              : null
            }
            {user.contacts.snapchat ?
              <div className='sm-link'>
                <a 
                  href={`https://snapchat.com/add/${user.contacts.snapchat}`}
                  target="_"
                >
                  <img 
                    className="snap-icon"
                    src="https://1000logos.net/wp-content/uploads/2017/08/Snapchat-logo.png" 
                    alt={`https://snapchat.com/${user.contacts.snapchat}`}/>
                </a>
                </div>
              : null
            }
            {user.contacts.facebook ?
              <div className='sm-link'>
                <a 
                  href={`https://www.facebook.com/${user.contacts.facebook}`}
                  target="_"
                >
                  <img 
                    className="fb-icon"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" 
                    alt={`https://www.facebook.com/${user.contacts.facebook}`}/>
                </a></div>
              : null
            }
            {user.contacts.phoneNumber ?
              <div className="sm-link">
                  <a href={`tel: ${user.contacts.phoneNumber}`}
                  target="_"
                  >
                    <img 
                    src={userClient.baseUrl+'static/phone-icon.png'} 
                    alt="Phone" 
                    className='phone-icon'
                  />
                  </a>
                </div>
              : null
            }
          </div>
        )
        : "No Contact info"
    }

    const renderMatch = (user: MyMatchUserData, i: number) => {
      console.log(matches)
      return (
          <div key={i}>
              <div className="tiles-mymatches" >
                  <div>
                    <div className="text-mymatches">{user.firstName}</div>
                    <div className="text-nummatches">Matched by {user.numMatchers} user</div><br></br>
                  </div>
                  <br></br>
                  <button type="button" className="tileImg-mymatches img-button" onClick={() => onUserExpand(i)()}>
                    {user.profilePicUrl ?
                      <img src={user.profilePicUrl} alt="profile picture" className="tileImg-mymatches img-button"/>
                      : <div><br></br><br></br></div>
                    }
                  </button>
                  <div className="bio-text">{user.bio}</div>
                  {user.myResponse === 'pending' ? 
                    <div>
                      <button 
                        className="accept-button"
                        onClick={acceptMatchHandler(user.id, i)}
                      >√</button>
                      <button 
                        className='reject-button'
                        onClick={rejectMatchHandler(user.id, i)}
                      >x</button>
                    </div>
                    : 
                    <div>
                      {user.response === 'accept' ? 
                        renderSocial(user)
                      : <div><br></br>Waiting for {user.firstName} to respond</div>
                      }
                    </div>
                      
                  }
              </div>
              <Popup open={open} closeOnDocumentClick onClose={closeModal}>
              <div id="pop">{renderBioPop(i)}
                  <button onClick={closeModal} className='pop-close'>Back to My Matches</button>
              </div>
              </Popup>
          </div>
      )
    }
    return (
      <div>
        { loading ? "loading" :
          <div className='page-mymatches'>
            <head><link rel="stylesheet" href="https://use.typekit.net/six1nsj.css"></link></head>
            <div className='mymatches-font'>
                my matches
            </div>
          <br></br><br></br><br></br><br></br>
          {matches.length ?
            matches.map((user, i) => renderMatch(user, i)) 
            : <div className='no-matches'>You don't have any matches quite yet, head over to your <b>feed page</b> to match others so that you can receive more matches for yourself!</div>
          }
          <br></br><br></br><br></br><br></br><br></br>
          </div>
        }
      </div>
    )
}