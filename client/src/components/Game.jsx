import { useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";

import { ChoiceForm } from "./ChoiceForm";

function Game() {
  const [ownedCards, setOwnedCards] = useState([]); 
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [nextCard, setNextCard] = useState();

  const startGame = () => {
    setOwnedCards([
      { id: 1, name: "Your only pen runs out of ink during a lecture.", path: "/card1.jpeg", rate: 1 },
      { id: 2, name: "Your favorite library spot is taken. Again.", path: "/card2.jpeg", rate: 3 },
      { id: 3, name: "The vending machine just ate your last coin.", path: "/card3.jpeg", rate: 5 },
    ]);

    setNextCard(
      { id: 4, name: "You sit down in the lecture hall, then realize it's the wrong class.", path: "/card4.jpeg", rate: 7 }
    );
    
    setGameStarted(true);
    setRound(1);
  };

  return (
    <>
      <Row className="flex-grow-1 m-3 gx-3">
        <Col sm={9} className="d-flex ps-0">
          <OwnedCards cards={ ownedCards } />
        </Col>

        <Col sm={3} className="pe-0">
        {
          gameStarted ?
            <Choices round={ round } nextCard={ nextCard }/> 
          :
            <StartGame startGame={ startGame } />
        }            
        </Col>
      </Row>
    </>
  );
}

function StartGame(props) {
  return (
    <div className="text-center shadow rounded p-3">
      <h4 className="m-0" >Are you ready?</h4>

      <Button variant="primary" size="lg" className="shadow mt-3" onClick={ () => props.startGame() }>
        Start Game
      </Button>
    </div>
  );
}

function OwnedCards(props) {
  const cards = props.cards.map(card =>
    <Col key={ card.id } className="d-flex mt-0 mb-0">
      <Card className="shadow rounded h-100">
        <Card.Img className="img-card rounded" variant="top" src={ card.path } />
          
        <Card.Body className="d-flex flex-column p-0">
          <Card.Text className="flex-grow-1 text-center mt-2 mb-2">
              { card.name }
          </Card.Text>

          <Card.Title className="text-center mt-auto">
              { card.rate }
          </Card.Title>

        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="table flex-grow-1 shadow rounded mb-0 p-3">
      { 
        props.cards.length === 0 ?
          <div className="d-flex justify-content-center align-items-center h-100">
            <h4 className="text-center mb-0">You don't have any cards yet. Start a game to get them.</h4>
          </div>
        :
        <>
          <h4 className="mb-0">Your Cards:</h4>

          <Row className="mt-2 g-3">
            { cards }
          </Row>
        </>
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

        <h4 className="mb-0">{ `Timer: 30s` }</h4>
      </div>

      <NewChioce />
    </div>
  );
}

function NextCard(props) {
  return (
    <div className="d-flex flex-column align-items-center">
      <h4 className="mb-1">Next card:</h4>

      <Card className="h-auto w-75 shadow rounded p-2">
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
    <div className="mt-2">
      <h4 className="mb-0">Interval: </h4>

      <ChoiceForm />
    </div>
  );
}

export { Game };