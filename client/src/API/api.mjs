const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errMessage = await response.text();
    throw errMessage;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'GET',
    credentials: 'include'
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errMessage = await response.text();
    throw errMessage;
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/logout', {
    method: 'DELETE',
    credentials: 'include'
  });

  if (response.ok)
    return null;
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const API = { logIn, logOut, getUserInfo };
export default API;