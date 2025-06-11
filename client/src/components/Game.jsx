import { useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Card, Button } from "react-bootstrap";

import { API } from "../API/api.mjs";

import { ChoiceForm } from "./ChoiceForm";

function Game() {
  const [ownedCards, setOwnedCards] = useState([]); 
  const [nextCard, setNextCard] = useState();
  const [round, setRound] = useState(0);
  const [roundStarted, setRoundStarted] = useState(false);
  const { gameId } = useParams();
  const [message, setMessage] = useState({ msg: '', type: '' });

  const startRound = async () => {
    try {
      setRound(round => round + 1)
      await API.newRound(round, gameId);      
      setRoundStarted(true);
    } catch (error) {
      setMessage({ msg: `Error: ${ err.error }`, type: 'danger' });
    }
  }

  const endRound = () => {
  }

  // Fetch owned cards and next card when the component mounts
  useEffect(() => {

  }, [roundStarted]);

  
  return (
    <>
      <Row className="flex-grow-1 m-3 gx-3">
        <Col sm={9} className="ps-0">
          <OwnedCards cards={ ownedCards } />
        </Col>

        <Col sm={3} className="pe-0">
        {
          roundStarted ?
            <Choices round={ round } nextCard={ nextCard } rates={ ownedCards.map(card => card.rate) } /> 
          :
            <StartRound startRound={ startRound } />
        }            
        </Col>
      </Row>
    </>
  );
}

function StartRound(props) {
  return (
    <div className="text-center shadow rounded p-3">
      <h4 className="m-0" >Are you ready?</h4>

        <Button variant="success" size="lg" className="shadow mt-2" onClick={ () => props.startRound() }>
          Start Round
        </Button>
    </div>
  );
}

function OwnedCards(props) {
  const cards = props.cards.map(card =>
    <Col key={ card.id } className="d-flex align-items-center mt-0">
      <GameCard card= { card }/>
    </Col>
  );

  return (
    <div className="table d-flex flex-column justify-content-start h-100 shadow rounded mb-0 p-3">
      { 
        props.cards.length === 0 ?
          <h4 className="text-center mb-0">You don't have any cards yet. Start a game to get them.</h4>
        :
          <>
            <h4 className="text-center mb-0">Your Cards:</h4>

            <Row className="flex-grow-1 d-flex align-items-center justify-content-center mt-2 g-3">
              { cards }
            </Row>
          </>
      }
    </div>
  );
}

function GameCard(props) {
  return (
    <Card className="shadow rounded">
      <Card.Img className="img-card rounded" variant="top" src={ props.card.path } />
        
      <Card.Body className="d-flex flex-column p-0">
        <Card.Text className="flex-grow-1 d-flex align-items-center text-center mt-2 mb-0">
            { props.card.name }
        </Card.Text>

        <Card.Title className="text-center mt-2 mb-0">
            { props.card.rate }
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

function Choices(props) {
  return (
    <div className="d-flex flex-column h-100 shadow rounded p-3">
      <NextCard nextCard={ props.nextCard } />

      <div className="d-flex justify-content-between mt-3">
        <h4 className="mb-0">{ `Round: ${ props.round }` }</h4>

        <h4 className="mb-0">{ `Timer: 30 s` }</h4>
      </div>

      <NewChioce rates={ props.rates }/>
    </div>
  );
}

function NextCard(props) {
  return (
    <div className="d-flex flex-column align-items-center">
      <h4 className="mb-0">Next card:</h4>

      <Card className="h-auto w-75 shadow rounded mt-1 p-2">
        <Card.Img className="img-card rounded" variant="top" src={ props.nextCard.path } />
          
        <Card.Body className="p-0">
          <Card.Text className="text-center mt-1">
              { props.nextCard.name }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

function NewChioce(props) {
  return (
    <div className="mt-3">
      <ChoiceForm rates={ props.rates }/>
    </div>
  );
}

export { Game };