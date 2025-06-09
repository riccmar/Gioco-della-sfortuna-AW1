import { Alert } from "react-bootstrap";

function Home(props) {
  return (
    <>
      <div className="mt-3">
        { props.message && props.message.type === 'success' && <Alert variant="success" dismissible>{ props.message.msg }</Alert> }
        Siamo in fase di test
      </div>
    </>
  );
}

export default Home;