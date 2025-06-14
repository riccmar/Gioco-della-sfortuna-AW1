import { Models } from "../models/GameModels";

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

const newRound = async (gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const res = await response.json();
    return res.round;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getCurrentRound = async (gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const res = await response.json();
    return res.round;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getOwnedCards = async (round, gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/${ round }/cards`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const cards = await response.json();

    for (const card of cards) {
      card.path = SERVER_URL + `/static/${ card.path }`;
    }

    return cards.map(card => new Models.Card(card.id, card.name, card.path, card.rate));
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getNextCard = async (round, gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/${ round }/cards/next`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (response.ok) {
    const card = await response.json();
    card.path = SERVER_URL + `/static/${ card.path }`;

    return new Models.HiddenCard(card.id, card.name, card.path);
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const checkEndRound = async (choice, gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/last`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ choice }),
  });

  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}

const getOptions = async (round, gameId) => {
  const response = await fetch(SERVER_URL + `/api/games/${ gameId }/rounds/${ round }/options`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const res = await response.json();
    return res.options;
  } else {
    const errMessage = await response.json();
    throw errMessage;
  }
}


const API = { logIn, logOut, getUserInfo, createMatch, newRound, getCurrentRound, getOwnedCards, getNextCard, checkEndRound, getOptions };
export { API };