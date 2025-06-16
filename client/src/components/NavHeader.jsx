import { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router";

import { LoggedInContext } from "../contexts/userContext.mjs";

import { LoginButton, LogoutButton, ProfileButton } from "./AuthComponents";

function NavHeader(props) {
  const location = useLocation();
  const loggedIn = useContext(LoggedInContext);
  const { gameId } = useParams();

  return (
    <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid>
          {
            location.pathname === `/match/${ gameId }` ? (
              <h1 className="text-light mt-1 mb-1">Stuff Happens</h1>
            ) : (
              <Link to={ '/' } className="text-light text-decoration-none">
                  <h1 className="mt-1 mb-1">Stuff Happens</h1>
              </Link>
            )
          }
          
          {
            location.pathname !== '/login' && !loggedIn && location.pathname !== `/match/${ gameId }` &&
             <LoginButton />
          }

          {
            loggedIn && location.pathname !== `/match/${ gameId }` && 
            <div className="d-flex gap-3">
                <LogoutButton handleLogout={ props.handleLogout } />
              {
                location.pathname !== '/profile' && <ProfileButton />
              }
            </div>
          }
        </Container>
    </Navbar>
  );
}

export { NavHeader };