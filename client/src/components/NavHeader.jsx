import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router";

function NavHeader() {
  const location = useLocation();

  return (
    <Navbar bg="primary" data-bs-theme="dark">
        <Container fluid >
          <Navbar.Brand>
            <h1 className="mb-0">Stuff Happens</h1>
          </Navbar.Brand>

          {
            location.pathname !== '/login' && 
            <Link to={ '/login' } className="fs-2 text-decoration-none bi bi-person-circle d-flex flex-column align-items-center justify-content-center">
                <span className="fs-6">Login</span>
            </Link>
          }
        </Container>
    </Navbar>
  );
}

export default NavHeader;