import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

import NavHeader from "./NavHeader";
import Footer from "./Footer";

function DefaultLayout(props) {
  return(
    <>
      <NavHeader handleLogout={ props.handleLogout } />

      <Container fluid>
        <Outlet />
      </Container>

      <Footer />
    </>
  );
}

export default DefaultLayout;