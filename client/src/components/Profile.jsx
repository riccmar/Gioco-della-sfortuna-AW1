import { useContext } from 'react';
import { UserContext } from '../contexts/userContext.mjs';
import { Row, Col } from 'react-bootstrap';

function Profile() {
  const user = useContext(UserContext);

  return (
    <>
      <Row className="intro-profile d-flex justify-content-between align-items-center shadow rounded m-3 p-3">
        <Col xs={ 6 }>
          <h4 className="mb-0">{ `Hi, ${ user.name }` }</h4>
        </Col>

        <Col xs={ 6 }>
          <h6 className="text-end mb-0">{ `Total Games: ${ 0 }` }</h6>
        </Col>
      </Row>
    
    
    
    </>


  );
}

export { Profile };