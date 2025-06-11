import { get } from "http";

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
    const errMessage = await response.text();
    throw errMessage;
  }
}

const createMatch = async () => {
  const response = await fetch(SERVER_URL + '/api/games/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (response.ok) {
    const res = await response.json();
    return res.gameId;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const newRound = async (round, gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ round }),
  });

  if (response.ok) {
    return true;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getOwnedCards = async (round, gameId, userId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/${ round }/cards`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const cards = await response.json();
    return cards;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getNextCard = async (round, gameId, userId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/${ round }/cards/next`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const card = await response.json();
    return card;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}


const API = { logIn, logOut, getUserInfo, createMatch, newRound, getOwnedCards, getNextCard };
export default API;