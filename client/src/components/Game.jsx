import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Alert } from "react-bootstrap";

import { API } from "../API/api.mjs";

import { OwnedCards } from "./OwnedCards";
import { Choices, StartRound } from "./GameControls";

const ROUND_TIME = 30;

function Game() {
  const [ownedCards, setOwnedCards] = useState([]); 
  const [nextCard, setNextCard] = useState();
  
  const [round, setRound] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);

  const [roundTimer, setRoundTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  
  const [message, setMessage] = useState({ msg: '', type: '' });
  const { gameId } = useParams();

  const handleStartRound = async () => {
    try {
      const nextRound = await API.newRound(gameId);      
      setRound(nextRound);

      setTimeLeft(ROUND_TIME);

      if (roundTimer) {
        clearTimeout(roundTimer);
      }
      const timerId = setTimeout(() => {
        handleEndRound('timeout');
      }, 1000 * ROUND_TIME );
      setRoundTimer(timerId);

      setRoundStarted(true);
    } catch (err) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }
  
  const handleEndRound = async (choice) => {
    try {
      if (roundTimer) {
        clearTimeout(roundTimer);
        setRoundTimer(null);
      }
      setTimeLeft(ROUND_TIME);
      
      const result = await API.checkEndRound(choice, gameId);
      setMessage({ msg: result.message, type: result.type });

      setRoundStarted(false);
    } catch (error) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }
  
  useEffect(() => {
    async function takeCards() {
      const roundCurrent = await API.getCurrentRound(gameId);
      setRound(roundCurrent);

      const cards = await API.getOwnedCards(roundCurrent, gameId);
      setOwnedCards(cards);

      if (roundCurrent >= 1 && roundStarted) {
        const nextC = await API.getNextCard(roundCurrent, gameId);
        setNextCard(nextC);
      }
    }

    takeCards();
  }, [ round, roundStarted ]);

  useEffect(() => {
    if (!roundStarted || timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [ roundStarted, timeLeft ]);

  return (
    <>
      { message && message.msg && message.type &&
        <Alert variant={ message.type } className="m-3 mb-0" onClose={ () => setMessage({ msg: '', type: '' }) } dismissible>{ message.msg }</Alert>
      }

      <Row className="flex-grow-1 m-3 gx-3">
        <Col sm={9} className="ps-0">
          <OwnedCards cards={ ownedCards } />
        </Col>

        <Col sm={3} className="pe-0">
        {
          roundStarted ?
            <Choices timeLeft={ timeLeft } round={ round } nextCard={ nextCard } endRound={ handleEndRound }/> 
          :
            <StartRound round={ round } startRound={ handleStartRound } message={ message } setMessage={ setMessage }/>
        }            
        </Col>
      </Row>
    </>
  );
}

export { Game };