import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, Navigate, useNavigate } from 'react-router'
import { useEffect, useState } from "react";

import { LoggedInContext, UserContext  } from "./contexts/userContext.mjs";

import { DefaultLayout } from "./components/DefaultLayout";
import { Home } from "./components/Home";
import { Game } from "./components/Game";
import { LoginForm } from "./components/AuthComponents";
import { NotFound } from "./components/NotFound";
import { Profile } from "./components/Profile";

import { API } from "./API/api.mjs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState({ msg: '', type: '' });
  const [gameId, setGameId] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
    } catch(err) {
      throw err;
    }
  }

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setMessage({ msg: `You have been logged out.`, type: 'success' });
      setUser('');
    } catch (err) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }

  const handleStartMatch = async () => {
    try {
      const gId = await API.createMatch(loggedIn);

      if (gId) {
        setGameId(gId);
        navigate(`/match/${ gId }`);
      } else {
        setMessage({ msg: 'Failed to start match.', type: 'danger' });
        navigate(`/`);
      }      
    } catch(err) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }

  return (
    <LoggedInContext.Provider value={ loggedIn }>
      <UserContext.Provider value={ user }>
        <Routes>
          <Route element={ <DefaultLayout handleLogout={ handleLogout } /> }>
            <Route path='/' element={ <Home message={ message } setMessage={ setMessage } handleStartMatch={ handleStartMatch } /> } />

            <Route path='/match/:gameId' element={ <Game key={ gameId } handleStartMatch={ handleStartMatch } /> } />

            <Route path='/login' element={ loggedIn ? <Navigate replace to='/' /> : <LoginForm handleLogin={ handleLogin } /> } />

            <Route path='/profile' element={ loggedIn ? <Profile /> : <Navigate replace to='/login' /> } />

            <Route path='*' element={ <NotFound /> } />
          </Route>
        </Routes>
      </UserContext.Provider>
    </LoggedInContext.Provider>
  )
}

export default App