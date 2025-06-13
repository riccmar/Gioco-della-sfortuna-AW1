import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";

function Home(props) {
  return (
    <>
      <div>
        { 
          props.message && props.message.msg && props.message.type &&
          <Alert variant={ props.message.type } className="m-3" onClose={ () => props.setMessage('') } dismissible> 
            { props.message.msg } 
          </Alert> 
        }

        <HomeIntro handleStartMatch={ props.handleStartMatch } />
      </div>
    </>
  );
}

function HomeIntro(props) {
  const [show, setShow] = useState(false);;

  return (
    <div className="intro-home text-center shadow rounded m-3 p-3">
        <h3 className="m-0">We turned years of university pain into a game. Now it's your turn!</h3>

        <Button variant="primary" size="lg" className="shadow mt-3" onClick={() => setShow(true)}>
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

export { Home };