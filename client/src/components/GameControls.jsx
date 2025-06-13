import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";

import { UserContext } from "../contexts/userContext.mjs";

import { ChoiceForm } from "./ChoiceForm";

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

      <NewChioce round={ props.round } endRound={ props.endRound }/>
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
      <ChoiceForm round={ props.round } endRound={ props.endRound }/>
    </div>
  );
}

export { StartRound, Choices };