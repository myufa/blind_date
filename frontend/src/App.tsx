import React, { Component, FC, useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Redirect, Route } from "react-router-dom";
import './App.scss'
import { Main } from "./pages";
import { TestClient } from "./pages/TestClient";
import { CreateUser } from "./pages/Auth/CreateUser";
import { LoginUser } from "./pages/Auth/LoginUser/LoginUser";
import { Matcher } from "./pages/Matcher/Matcher"; 
import { MyMatchesPage } from "./pages/MyMatches";
import { UserProfile } from "./pages/Profile"; 
import { MainNav } from "./components/MainNav";
import { authClient } from "./services";
// import { MainNav } from "./components/MainNav/MainNav";

const App: FC = () => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    authClient.isLoggedIn()
    .then(loggedInStatus => {
      console.log('loggedInStatus', loggedInStatus)
      setIsAuthed(loggedInStatus)
      setLoading(false)
    })
  }, [])
  return (
    <div className='App'>
      <Router>
        <div className='MainSection'>
            <Route 
              exact={true} path="/create-User/" 
              render={(props) => (
                loading ? null :
                isAuthed ?
                  <Redirect exact push to='/matcher/'/>
                  : <CreateUser />)}
            />
            <Route 
              exact={true} path="/login/" 
              render={(props) => (
                loading ? null :
                isAuthed ?
                  <Redirect exact push to='/matcher/'/>
                  : <LoginUser />)}
            />
            <Route 
              exact={true} path="/" 
              render={(props) => (<Main authenticated={true}/>)} 
            />
            <Route
              exact={true} path="/matcher/"
              render={(props) => (
                loading ? null :
                isAuthed ? 
                  <Matcher setPage={setPage}/> 
                  : <Redirect exact push to='/login/' />
              )}
              />
            <Route
              exact={true} path="/mymatches/"
              render={(props) => (
                loading ? null :
                isAuthed ? 
                  <MyMatchesPage setPage={setPage}/>
                  : <Redirect exact push to='/login/' />
                )}
            />
            <Route
              exact={true} path="/profile/"
              render={(props) => (
                loading ? null :
                isAuthed ? 
                  <UserProfile setPage={setPage}/>
                  : <Redirect exact push to='/login/' />
                )}
            />
        </div>
      </Router>
      {isAuthed ? 
        <MainNav page={page}/>
      : null}
      
    </div>
  )
  
}

export default App;