import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Alert } from "react-bootstrap";

import { API } from "../API/api.mjs";

import { OwnedCards } from "./OwnedCards";
import { Choices, StartRound } from "./GameControls";

function Game() {
  const [ownedCards, setOwnedCards] = useState([]); 
  const [nextCard, setNextCard] = useState();
  const [round, setRound] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const { gameId } = useParams();
  const [message, setMessage] = useState({ msg: '', type: '' });

  const handleStartRound = async () => {
    try {
      const nextRound = await API.newRound(gameId);      
      setRound(nextRound);
      setRoundStarted(true);
    } catch (err) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }
  
  const handleEndRound = async (choice) => {
    try {
      const result = await API.checkEndRound(choice, round, gameId);
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
            <Choices round={ round } nextCard={ nextCard } rates={ ownedCards.map(card => card.rate) } endRound={ handleEndRound }/> 
          :
            <StartRound round={ round } startRound={ handleStartRound } message={ message } setMessage={ setMessage }/>
        }            
        </Col>
      </Row>
    </>
  );
}

export { Game };