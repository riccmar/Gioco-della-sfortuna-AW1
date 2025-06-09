import sqlite from 'sqlite3';
import crypto from 'crypto';

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

const DAO = { getUser };
export { DAO };