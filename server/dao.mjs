import sqlite from 'sqlite3';
import crypto from 'crypto';
import dayjs from 'dayjs';

import { Models } from './GameModels.mjs';

// open the database
const db = new sqlite.Database('sh.sqlite', (err) => {
  if (err) 
    throw err;
});

// Get a specific user
const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user WHERE email = ?';

    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err);
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = new Models.User(row.id, row.name, row.email);
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

const createMatch = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO game (date, win, userId) VALUES (?, ?, ?)';

    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const win = 0;

    db.run(sql, [date, win, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

const createInitialRound = (gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM card ORDER BY RANDOM() LIMIT 3';

    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const win = -1;

    db.each(sql, [], (err, row) => {
      if (err) {
        reject(err);
      } else {
        const sql2 = 'INSERT INTO round (number, start, end, win, gameId, cardId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';

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

const createRound = (round, gameId, userId) => {
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
        const sql3 = 'INSERT INTO round (number, start, end, win, gameId, cardId, userId) VALUES (?, ?, ?, ?, ?, ?, ?)';

        const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const win = 0;

        db.run(sql3, [round, date, 0, win, gameId, row.id, userId], function(err) {
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

const getOwnedCards = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT card.idC, card.name, card.path, card.rate 
                 FROM round 
                 JOIN card ON round.cardId = card.idC 
                 WHERE round.number = ? AND round.gameId = ? AND round.userId = ?`;

    db.all(sql, [round, gameId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = rows.map(row => new Models.Card(row.idC, row.name, row.rate, row.image));
        
        resolve(cards);
      }
    });
  });
}

const getNextCard = (round, gameId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT card.idC, card.name, card.rate, card.image 
                 FROM round 
                 JOIN card ON round.cardId = card.idC 
                 WHERE round.number = ? AND round.gameId = ? AND round.userId = ?`;

    db.get(sql, [round, gameId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const card = new Models.Card(row.idC, row.name, row.rate, row.image);
        resolve(card);
      }
    });
  });
}


const DAO = { getUser, createMatch, createInitialRound, createRound, getOwnedCards, getNextCard };
export { DAO };