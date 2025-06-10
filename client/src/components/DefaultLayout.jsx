import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

import { NavHeader } from "./NavHeader";
import { Footer } from "./Footer";

function DefaultLayout(props) {
  return(
    <div className="d-flex flex-column min-vh-100">
      <NavHeader handleLogout={ props.handleLogout } />

      <Container fluid className="flex-grow-1 d-flex flex-column p-0">
        <Outlet />
      </Container>

      <Footer />
    </div>
  );
}

export { DefaultLayout };