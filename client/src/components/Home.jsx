import { useState } from "react";
import { Alert, Button, Col, ListGroup, Modal, Row } from "react-bootstrap";

function Home(props) {
  return (
    <>
        { 
          props.message && props.message.msg && props.message.type &&
          <Alert variant={ props.message.type } className="m-3 mb-0" onClose={ () => props.setMessage('') } dismissible> 
            { props.message.msg } 
          </Alert> 
        }

        <HomeIntro handleStartMatch={ props.handleStartMatch } />
        
        <HomeRules />
    </>
  );
}

function HomeIntro(props) {
  const [show, setShow] = useState(false);;

  return (
    <div className="intro-home text-center shadow rounded m-3 p-3">
        <h3 className="m-0">We turned years of university pain into a game. Now it's your turn!</h3>

        <Button variant="primary" size="lg" className="shadow mt-2" onClick={() => setShow(true)}>
          New Match
        </Button>

        <Modal show={ show } onHide={ () => setShow(false) }>
          <Modal.Header closeButton>
            <Modal.Title>Are you ready?</Modal.Title>
          </Modal.Header>

          <Modal.Body className="d-flex justify-content-center">
            <Button variant="success" size="lg" className="w-50" onClick={ () => {props.handleStartMatch(); setShow(false); }}>
              Start
            </Button>
          </Modal.Body>
        </Modal>
    </div>
  );
}

function HomeRules() {
  const rules = [
    {title: "Goal", description: "Collect 6 'Horrible Situation' cards to win the game."},
    {title: "Setup", description: "You start with 3 random cards, sorted by their 'Misfortune Index'."},
    {title: "Gameplay", description: "In each round, you are shown a new card without its index."},
    {title: "Time Limit", description: "You have 30 seconds to place the card."},
    {title: "Win a Round", description: "If your placement is correct, the card is added to your hand."},
    {title: "Challenge", description: "Guess where the new card's hidden index fits among your current cards."},
    {title: "Lose a Round", description: "If you are wrong or time expires, the card is discarded for the rest of the game."},
    {title: "Losing the Game", description: "You lose if you make three incorrect guesses."},
    {title: "Extra info", description: "You must be logged to play an entire match, but you can play 1 round without logging in."},
  ];

  return (
      <Row className="d-flex justify-content-center m-3 mt-0">
        <Col sm={ 5 } className="shadow rounded p-3">
          <h4 className="text-center mb-0"><i className="bi bi-controller me-2"></i>Game Rules</h4>
          
          <ListGroup as="ol" numbered>
            {
              rules.map(((rule, index) =>
                <ListGroup.Item
                  as="li"
                  key={ index }
                  className="d-flex justify-content-between align-items-start border-0"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{ `${ rule.title }` }</div>
                    { rule.description }
                  </div>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </Col>  
      </Row>
  );
}

export { Home };