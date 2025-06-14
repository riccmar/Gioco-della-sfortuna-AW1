import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import dayjs from 'dayjs';

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

app.use('/static', express.static('public'));


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
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

    const gameId = await DAO.createMatch(userId, date, -1);
    
    await DAO.createInitialRound(gameId, userId, date, 1);

    return res.status(201).json({ gameId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/games/:gameId/rounds/new
app.post('/api/games/:gameId/rounds/new', async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.isAuthenticated() ? req.user.id : 0;
  
  try {
    let round = await DAO.takeLastRound(gameId, userId);
    round++;
    if (!req.isAuthenticated() && round > 1) {
      return res.status(401).json({error: 'Unauthorized. You must be logged to play other rounds.'})
    }

    if (round > 5) {
      return res.status(400).json({ error: 'You cannot play more than 5 Rounds.' });
    }

    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const win = 0;

    await DAO.createRound(round, gameId, userId, date, win);

    return res.status(201).json({ round });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:gameId/rounds/current
app.get('/api/games/:gameId/rounds/current', async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    const round = await DAO.takeLastRound(gameId, userId);

    return res.status(200).json({ round });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:gameId/rounds/:round/cards
app.get('/api/games/:gameId/rounds/:round/cards',  async (req, res) => {
  const gameId = req.params.gameId;
  const round = req.params.round;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    if (!req.isAuthenticated() && round > 1) {
      return res.status(401).json({error: 'Unauthorized. You must be logged to play other rounds.'})
    }

    const cards = await DAO.getOwnedCards(round, gameId, userId);

    return res.status(200).json(cards);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:gameId/rounds/:round/cards/next
app.get('/api/games/:gameId/rounds/:round/cards/next',  async (req, res) => {
  const gameId = req.params.gameId;
  const round = req.params.round;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    if (!req.isAuthenticated() && round > 1) {
      return res.status(401).json({error: 'Unauthorized. You must be logged to play other rounds.'});
    }

    const card = await DAO.getNextCard(round, gameId, userId);

    return res.status(200).json(card);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:gameId/rounds/:round/options
app.get('/api/games/:gameId/rounds/:round/options', async (req, res) => {
  const gameId = req.params.gameId;
  const round = req.params.round;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    if (!req.isAuthenticated() && round > 1) {
      return res.status(401).json({error: 'Unauthorized. You must be logged to play other rounds.'});
    }

    const options = [];
    const ownedCards = await DAO.getOwnedCards(round, gameId, userId);
    const rates = ownedCards.map(card => card.rate);
    rates.sort((a, b) => a - b);

    if (rates[0] !== 1)
      options.push(`1 - ${ rates[0] }`);
    for (let i = 0; i < rates.length - 1; i++) {
      options.push(`${ rates[i] } - ${ rates[i + 1] }`);
    }
    options.push(`${ rates[rates.length - 1] } - 100`);

    return res.status(200).json({ options });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/games/:gameId/rounds/last
app.put('/api/games/:gameId/rounds/last', [
  check('choice').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const roundEndDate = dayjs();
  const userId = req.isAuthenticated() ? req.user.id : 0;
  const gameId = req.params.gameId;
  const round = await DAO.takeLastRound(gameId, userId);
  const choice = req.body.choice;

  try {
    if (!req.isAuthenticated() && round > 1) {
      return res.status(401).json({error: 'Unauthorized. You must be logged to play other rounds.'});
    }

    const roundStartDateString = await DAO.getRoundStartDate(round, gameId, userId);
    const roundStartDate = dayjs(roundStartDateString, 'YYYY-MM-DD HH:mm:ss');

    const difference = roundEndDate.diff(roundStartDate, 'second');
    if (difference > 30 || choice === 'timeout') {
      await DAO.updateRound(round, gameId, userId, roundEndDate.format('YYYY-MM-DD HH:mm:ss'), 0);
      return res.status(200).json({ message: 'Time up! Round lost. Card discarded.', type: 'danger' });
    }

    const [min, max] = choice.split('-').map(Number);
    
    const hiddenCard = await DAO.getCardByRound(round, gameId, userId);

    if (hiddenCard.rate > min && hiddenCard.rate < max) {
      await DAO.updateRound(round, gameId, userId, roundEndDate.format('YYYY-MM-DD HH:mm:ss'), 1);
      return res.status(200).json({ message: 'Correct Answer! Round won. Card added to yours.', type: 'success' });
    } else {
      await DAO.updateRound(round, gameId, userId, roundEndDate.format('YYYY-MM-DD HH:mm:ss'), 0);
      return res.status(200).json({ message: 'Wrong Answer! Round lost. Card discarded. ', type: 'danger' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/games/:gameId/end
app.put('/api/games/:gameId/end', async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  try {
    const rounds = await DAO.takeLastRound(gameId, userId);
    const ownedCards = await DAO.getOwnedCards(rounds, gameId, userId);
    const wrongChoices = await DAO.getWrongChoices(rounds, gameId, userId);

    if (ownedCards.length === 6) {
      await DAO.updateMatch(gameId, userId, 1);
      return res.status(200).json({ end: true, message: 'Correct answer! You won the match!', type: 'success' });
    } else if (rounds >= 5 || wrongChoices >= 3) {
      await DAO.updateMatch(gameId, userId, 0);
      return res.status(200).json({ end: true, message: 'Wrong answer! You lost the match!', type: 'danger' });
    }

    return res.status(200).json({ end: false });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/games/:gameId/result
app.get('/api/games/:gameId/result', async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.isAuthenticated() ? req.user.id : 0;

  let result = false;

  try {
    if (userId === 0) {
      return res.status(200).json({ result });
    }

    const win = await DAO.getMatchResult(gameId);
    if (win === 1 || win === 0)
      result = true;
    else
      result = false;

    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/games/list', isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    const games = await DAO.getUserMatches(userId);

    for (let game of games) {
      game.date = game.date.format('dddd, DD MMMM YYYY, HH:mm');
      game.rounds = await DAO.getUserMatchRounds(game.id, userId);
    }

    return res.status(200).json(games);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


/* activate the server */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});