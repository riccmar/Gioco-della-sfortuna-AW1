import { Card, Col, Row } from "react-bootstrap";

function OwnedCards(props) {
  const cards = props.cards.map(card =>
    <Col key={ card.id } className="d-flex align-items-center h-100 mt-0">
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

export { OwnedCards };