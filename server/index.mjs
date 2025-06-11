import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import cors from 'cors';
import { check, validationResult } from 'express-validator';

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
app.delete('/api/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// POST /api/games/new
app.post('/api/games/new', async (req, res) => {
  const userId = req.user.isAuthenticated() ? req.user.id : 0;

  try {
    const gameId = await DAO.createMatch(userId);
    
    await DAO.createInitialRound(gameId, userId);

    return res.status(201).json({ gameId });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// POST /api/games/:gameId/rounds/new
app.post('/api/games/:gameId/rounds/new', [
  check('round').notEmpty(),
  check('round').isNumeric(),
], isLoggedIn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({error: errors.array()});
  }

  const round = req.body.round;
  const gameId = req.params.gameId;
  const userId = req.user.isAuthenticated() ? req.user.id : 0;

  try {
    await DAO.createRound(round, gameId, userId);

    return res.status(201).end();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// GET /api/games/:gameId/rounds/:roundId/cards
app.get('/api/games/:gameId/rounds/:roundId/cards',  async (req, res) => {
  const gameId = req.params.gameId;
  const roundId = req.params.roundId;
  const userId = req.user.isAuthenticated() ? req.user.id : 0;

  try {
    const cards = await DAO.getOwnedCards(roundId, gameId, userId);

    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

// GET /api/games/:gameId/rounds/:roundId/cards
app.get('/api/games/:gameId/rounds/:roundId/cards/next',  async (req, res) => {
  const gameId = req.params.gameId;
  const roundId = req.params.roundId;
  const userId = req.user.isAuthenticated() ? req.user.id : 0;

  try {
    const card = await DAO.getNextCards(roundId, gameId, userId);

    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});


/* activate the server */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});