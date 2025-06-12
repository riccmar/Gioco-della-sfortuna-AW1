import { useContext, useEffect, useState } from "react";
import { UNSAFE_useFogOFWarDiscovery, useNavigate, useParams } from "react-router";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";

import { UserContext } from "../contexts/userContext.mjs";
import { API } from "../API/api.mjs";

import { ChoiceForm } from "./ChoiceForm";

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
      const cards = await API.getOwnedCards(round, gameId);
      setOwnedCards(cards);
      if (round !== 0 && roundStarted) {
        const nextC = await API.getNextCard(round, gameId);
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

function OwnedCards(props) {
  const cards = props.cards.map(card =>
    <Col key={ card.id } className="d-flex align-items-center mt-0">
      <GameCard card= { card }/>
    </Col>
  );
  
  return (
    <div className="table d-flex flex-column justify-content-start h-100 shadow rounded mb-0 p-3">
      <h4 className="text-center mb-0">Your Cards:</h4>

      <Row className="flex-grow-1 d-flex align-items-center justify-content-center mt-2 g-3">
        { cards }
      </Row>
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

function StartRound(props) {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="text-center shadow rounded p-3">
      <h4 className="mb-0" >
        {
          props.round === 1 && !user.name ?
            "Log in to play a full Game."
          :
            "Ready to start a new round?"
        }
      </h4>

      {
        props.round === 1 && !user ?
          <div className="d-flex justify-content-center">
            <Button variant="warning" size="lg" className="shadow mt-3 me-3" onClick={ () => navigate('/') }>
              Home
            </Button>

            <Button variant="success" size="lg" className="shadow mt-3" onClick={ () => navigate('/login') }>
              Login
            </Button>
          </div>
        :
          <Button variant="success" size="lg" className="shadow mt-3" onClick={ () => props.startRound() }>
            Start Round
          </Button>
      }
    </div>
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

      <NewChioce rates={ props.rates } endRound={ props.endRound }/>
    </div>
  );
}

function NextCard(props) {
  return (
    <div className="d-flex flex-column align-items-center">
      <h4 className="mb-0">Next card:</h4>

      {
        props.nextCard ?
          <Card className="h-auto w-75 shadow rounded mt-1 p-2">
            <Card.Img className="img-card rounded" variant="top" src={ props.nextCard.path } />
              
            <Card.Body className="p-0">
              <Card.Text className="text-center mt-1">
                  { props.nextCard.name }
              </Card.Text>
            </Card.Body>
          </Card>
        :
          <p className="mt-1">Next card is loading...</p>
      }
    </div>
  );
}

function NewChioce(props) {
  return (
    <div className="mt-3">
      <ChoiceForm rates={ props.rates } endRound={ props.endRound }/>
    </div>
  );
}

export { Game };