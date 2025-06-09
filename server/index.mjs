import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import cors from 'cors';

import { DAO } from './dao.mjs';

/* init express */
const app = express();
const port = 3001;


/* middleware */
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  secret: "shh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await DAO.getUser(username, password);
  
  if (!user)
    return cb(null, false);
  
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({error: 'Unauthorized'});
}


/* routes */
// POST /api/login
app.post('/api/login', passport.authenticate('local'), function(req, res) {
  return res.status(200).json(req.user);
});

// GET /api/sessions/current
app.get('/api/sessions/current', isLoggedIn, (req, res) => {
  res.json(req.user);
});

// DELETE /api/logout
app.delete('/api/logout', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


/* activate the server */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});