import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

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

        <HomeIntro />
      </div>
    </>
  );
}

function HomeIntro() {
  const navigate = useNavigate();

  return (
    <div className="intro-home text-center shadow rounded m-3 p-3">
        <h3 className="m-0">We turned years of university pain into a game. Now it's your turn!</h3>

        <Button variant="primary" size="lg" className="shadow mt-3" onClick={() => navigate('/game')}>
          New Match
        </Button>
    </div>
  );
}

export { Home };