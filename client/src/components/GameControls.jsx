import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";

import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import { UserContext } from "../contexts/userContext.mjs";

import { ChoiceForm } from "./ChoiceForm";

function EndMatch(props) {
  const navigate = useNavigate();

  return (
    <div className="text-center shadow rounded p-3">
      <h4 className="mb-0">Are you ready for another Match?</h4>
      
      <div className="d-flex justify-content-center">
        <Button variant="warning" size="lg" className="shadow mt-2 me-3" onClick={ () => navigate('/') }>
          Home
        </Button>

        <Button variant="primary" size="lg" className="shadow mt-2" onClick={ () => props.handleStartMatch() }>
          New Match
        </Button>
      </div>
    </div>
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
          <>
            <div className="d-flex justify-content-center">
              <Button variant="warning" size="lg" className="shadow w-50 mt-2 me-3" onClick={ () => navigate('/') }>
                Home
              </Button>

              <Button variant="success" size="lg" className="shadow w-50 mt-2" onClick={ () => navigate('/login') }>
                Login
              </Button>
            </div>

            <Button variant="primary" size="lg" className="shadow mt-4" onClick={ () => props.handleStartMatch() }>
              New Match (Demo)
            </Button>
          </>
        :
          <Button variant="success" size="lg" className="shadow mt-2" onClick={ () => { props.startRound(); props.setMessage({msg: '', type: ''}) } }>
            Start Round
          </Button>
      }
    </div>
  );
}

function Choices(props) {
  return (
    <div className="d-flex flex-column shadow rounded p-3">
      <NextCard nextCard={ props.nextCard } />

      <div className="d-flex justify-content-between align-items-center mt-3">
        <h4 className="mb-0">{ `Round: ${ props.round }` }</h4>

        <CountdownCircleTimer
          isPlaying
          duration={ 30 }
          colors={['#408558', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[12, 5, 2, 0]}
          size={ 50 }
          strokeWidth = { 6 }
        >
          {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
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
          <Card className="h-auto w-75 shadow rounded mt-0 p-2">
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

export { EndMatch, StartRound, Choices };