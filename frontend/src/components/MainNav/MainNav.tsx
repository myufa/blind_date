import React, { FC, useEffect, useRef, useState } from "react";
import './MainNav.scss'
import { userClient } from "../../services/user/userClient";

export const MainNav: FC<{page: number}> = (props) => {
  return (
    <div>
        <div className='main-nav'>
          <div className='my-matches' onClick={()=>window.open('/mymatches/', '_self')}>
            <img 
              src={userClient.baseUrl+'static/mymatches-icon.png'} 
              alt="My Matches" 
              className={props.page === 0 ? 'selected' : undefined}
            />
            <div>My Matches</div>
          </div>
          <div className='feed' onClick={()=>window.open('/matcher/', '_self')}>
            <img 
              src={userClient.baseUrl+'static/feed-icon.png'} 
              alt="Feed" 
              className={props.page === 1 ? 'selected' : undefined}
            />
            <div>Feed</div>
          </div>
          <div className='profile' onClick={()=>window.open('/profile/', '_self')}>
            <img 
              src={userClient.baseUrl+'static/profile-icon.png'} 
              alt="Profile" 
              className={props.page === 2 ? 'selected' : undefined}
            />
            <div>Profile</div>
          </div>
        </div>
    </div>
  )
}