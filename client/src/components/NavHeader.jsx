import { useContext } from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router";

import { LoggedInContext } from "../contexts/userContext.mjs";

import { LoginButton, LogoutButton, ProfileButton } from "./AuthComponents";

function NavHeader(props) {
  const location = useLocation();
  const loggedIn = useContext(LoggedInContext);

  return (
    <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid>
          {
            location.pathname === '/game' ? (
              <h1 className="mb-0">Stuff Happens</h1>
            ) : (
              <Link to={ '/' } className="text-light text-decoration-none">
                  <h1 className="mb-0">Stuff Happens</h1>
              </Link>
            )
          }
          
          {
            location.pathname !== '/login' && !loggedIn && <LoginButton />
          }

          {
            loggedIn && 
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

export default NavHeader;