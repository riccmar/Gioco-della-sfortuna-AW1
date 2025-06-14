import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../contexts/userContext.mjs';
import { Row, Col, Accordion, Badge, Table } from 'react-bootstrap';

import { API } from '../API/api.mjs';

function Profile() {
  const user = useContext(UserContext);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const matchList = await API.getMatchList();
      setMatches(matchList);
    }

    fetchMatches();
  }, []);

  return (
    <>
      <Row className="intro-profile d-flex justify-content-between align-items-center shadow rounded m-3 p-3">
        <Col xs={ 6 }>
          <h4 className="mb-0">{ `Hi, ${ user.name }` }</h4>
        </Col>

        <Col xs={ 6 }>
          <h5 className="text-end mb-0">{ `Total Matches: ${ matches.length }` }</h5>
        </Col>
      </Row>

      <Row className="shadow rounded m-3 mt-0 p-3">
        <h4 className="mb-0">
          Match history:
        </h4>

        {
          matches.length > 0 ?
            <Accordion className="mt-2">
              {
                matches.map((match) =>
                  <MatchItem key={ match.id } match={ match } />
                )
              }
            </Accordion>
          :
            <p className="text-center bi bi-emoji-frown mt-2">{ ` - No matches played yet.` }</p>
        }

      </Row>
    </>
  );
}

function MatchItem(props) {
  return (
    <Accordion.Item eventKey={ props.match.id }>
      <Accordion.Header>
        <i className="bi bi-calendar3 me-2"></i>{ `${ props.match.date }` }

        <Badge pill bg={ props.match.win ? "success" : "danger" } className="ms-4">
          { 
            props.match.win ? 
              <>
                <i className="bi bi-trophy me-2"></i> Won 
              </>
            : 
              "Lost"
         }
        </Badge>
      </Accordion.Header>

      <Accordion.Body>
        <h5 className="mb-0">
          {
            `Collected cards: ${ props.match.rounds.filter(r => r.win === 1).length } / 6`
          }
        </h5>


        <Table hover striped bordered responsive className="mt-2 mb-0">
          <thead>
            <tr>
              <th >Round</th>
              <th>Card Situation</th>
              <th>Result</th>
            </tr>
          </thead>

          <tbody>
            {
              props.match.rounds.map((round, i) =>
                <tr key={ i }>
                  <td className="text-center"><b>{ round.number }</b></td>
                  <td>{ round.name }</td>
                  <td>
                    { 
                      round.number === 0 ?
                        <Badge pill bg="info" >
                          Start
                        </Badge> 
                      :
                        <Badge pill bg={ round.win ? "success" : "danger" } >
                          { round.win ? "Correct" : "Wrong" }
                        </Badge> 
                    }
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export { Profile };