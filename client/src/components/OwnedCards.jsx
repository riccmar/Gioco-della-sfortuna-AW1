import { Card, Col, Row } from "react-bootstrap";

function OwnedCards(props) {
  const cards = props.cards.map(card =>
    <Col key={ card.id } className="d-flex mt-0">
      <GameCard card= { card }/>
    </Col>
  );
  
  return (
    <div className="table shadow rounded mb-0 p-3">
      <h4 className="text-center mb-0">Your Cards:</h4>

      {
        props.cards.length === 0 ?
          <p className="text-center bi bi-emoji-frown mt-2"> - No cards owned yet.</p>
        :
          <Row className="flex-grow-1 d-flex align-items-stretch bg-transparent mt-2 g-3">
              { cards }
          </Row>
      }
    </div>
  );
}

function GameCard(props) {
  return (
    <Card className="shadow rounded flex-fill h-100 p-2">
      <Card.Img className="img-card rounded" variant="top" src={ props.card.path } />
        
      <Card.Body className="d-flex flex-column p-0">
        <Card.Text className="flex-grow-1 d-flex align-items-center justify-content-center text-center mt-2 mb-0">
            { props.card.name }
        </Card.Text>

        <Card.Title className="text-center mt-2 mb-0">
            { props.card.rate }
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export { OwnedCards };