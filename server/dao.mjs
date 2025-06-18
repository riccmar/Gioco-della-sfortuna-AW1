import sqlite from 'sqlite3';
import crypto from 'crypto';

import { Models } from './GameModels.mjs';
import { get } from 'http';

// open the database
const db = new sqlite.Database('sh.sqlite', (err) => {
  if (err) 
    throw err;
});

// Get a specific user
const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT * 
                  FROM user 
                  WHERE email = ?`;

    db.get(sql1, [email], (err, row) => {
      if (err) { 
        reject(err);
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = new Models.User(row.idU, row.name, row.email);
        const salt = row.salt;
        
        crypto.scrypt(password, salt, 32, function(err, hashedPassword) {
          if (err) 
            reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
}

const createMatch = (userId, date, win) => {
  return new Promise((resolve, reject) => {
    const sql1 = `INSERT INTO game (date, win, userId) 
                  VALUES (?, ?, ?)`;

    db.run(sql1, [date, win, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

const updateMatch = (gameId, userId, win) => {
  return new Promise((resolve, reject) => {
    const sql1 = `UPDATE game 
                  SET win = ? 
                  WHERE idG = ? AND userId = ?`;

    db.run(sql1, [win, gameId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

const getMatchResult = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT win 
                  FROM game 
                  WHERE idG = ?`;

    db.get(sql1, [gameId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Game not found."});
      } else {
        resolve(row.win);
      }
    });
  });
}

const getMatchCreator = (gameId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT userId 
                  FROM game 
                  WHERE idG = ?`; 
    
    db.get(sql1, [gameId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Game not found."});
      } else {
        resolve(row.userId);
      }
    });
  });
}

const createInitialRound = (gameId, userId, date, win) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT * 
                  FROM card 
                  ORDER BY RANDOM() LIMIT 3`;

    db.each(sql1, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const sql2 = `INSERT INTO round (number, start, end, win, gameId, cardId, userId) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql2, [0, date, date, win, gameId, row.idC, userId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
}

const createRound = (round, gameId, userId, date, win) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT cardId 
                  FROM round 
                  WHERE gameId = ? AND userId = ? AND cardId <> 0`;
    const sql2 = `SELECT *
                  FROM card 
                  WHERE idC NOT IN (${sql1}) 
                  ORDER BY RANDOM() 
                  LIMIT 1`;

    db.each(sql2, [gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const sql3 = `INSERT INTO round (number, start, end, win, gameId, cardId, userId) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql3, [round, date, 0, win, gameId, row.idC, userId], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      }
    });
  });
}

const takeLastRound = (gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT number
                  FROM round 
                  WHERE gameId = ? AND userId = ? 
                  ORDER BY number DESC LIMIT 1`;

    db.get(sql1, [gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Last Round not found."});
      } else {
        resolve(row.number);
      }
    });
  });
}

const getRoundStartDate = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT start
                  FROM round
                  WHERE number = ? AND gameId = ? AND userId = ?`;

    db.get(sql1, [round, gameId, userId], (err, row) => { 
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Round not found."});
      } else {
        resolve(row.start);
      }
    }
    );
  });
}

const updateRound = (round, gameId, userId, endDate, win) => {
  return new Promise((resolve, reject) => {
    const sql1 = `UPDATE round 
                  SET end = ?, win = ? 
                  WHERE number = ? AND gameId = ? AND userId = ?`;

    db.run(sql1, [endDate, win, round, gameId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

const getOwnedCards = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT card.idC, card.name, card.path, card.rate 
                  FROM round 
                  JOIN card ON round.cardId = card.idC 
                  WHERE win = 1 AND round.number <= ? AND round.gameId = ? AND round.userId = ?
                  ORDER BY card.rate`;

    db.all(sql1, [round, gameId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = rows.map(row => new Models.Card(row.idC, row.name, row.path, row.rate));
        resolve(cards);
      }
    });
  });
}

const getNextCard = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT card.idC, card.name, card.path 
                  FROM round 
                  JOIN card ON round.cardId = card.idC 
                  WHERE round.number = ? AND round.gameId = ? AND round.userId = ?`;

    db.get(sql1, [round, gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Next Card not found."});
      } else {
        const card = new Models.Card(row.idC, row.name, row.path);
        resolve(card);
      }
    });
  });
}

const getCardByRound = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT card.idC, card.name, card.path, card.rate 
                  FROM round
                  JOIN card ON round.cardId = card.idC 
                  WHERE round.number = ? AND round.gameId = ? AND round.userId = ?`;

    db.get(sql1, [round, gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        reject({message: "Card not found."});
      } else {
        const card = new Models.Card(row.idC, row.name, row.path, row.rate);
        resolve(card);
      }
    });
  });
}

const getWrongChoices = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT COUNT(*) as wrongChoices
                  FROM round
                  WHERE round.number <= ? AND round.gameId = ? AND round.userId = ? AND round.win = 0`;
    
    db.get(sql1, [round, gameId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows === undefined) {
        reject({message: "Wrong choices not found."});
      } else {
        resolve(rows.wrongChoices);
      }
    });
  });
}

const getUserMatches = (userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT idG, date, win
                  FROM game
                  WHERE userId = ? AND win <> -1
                  ORDER BY date`;

    db.all(sql1, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const games = rows.map(row => new Models.Game(row.idG, row.date, row.win));
        resolve(games);
      }
    });
  });
}

const getUserMatchRounds = (gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql1 = `SELECT round.number, round.win, card.name
                  FROM round
                  JOIN card ON round.cardId = card.idC
                  WHERE round.gameId = ? AND round.userId = ?
                  ORDER BY number`;

    db.all(sql1, [gameId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}


const DAO = { getUser, 
              createMatch, updateMatch, getMatchResult, getMatchCreator,
              createInitialRound, createRound, takeLastRound, updateRound, getRoundStartDate, 
              getOwnedCards, getNextCard, getCardByRound, 
              getWrongChoices,
              getUserMatches, getUserMatchRounds };
export { DAO };