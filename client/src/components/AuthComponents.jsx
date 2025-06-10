import "bootstrap-icons/font/bootstrap-icons.css";
import { useActionState, useContext, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router";

import { UserContext } from "../contexts/userContext.mjs";

function LoginForm(props) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {username: '', password: ''});
  const [alertVisible, setAlertVisible] = useState(false);

  async function handleSubmit(prevState, formData) {
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    if (credentials.username === undefined) {
      setAlertVisible(true);
      return { error: 'Username cannot be empty.' };
    } else if (credentials.password === undefined) {
      setAlertVisible(true);
      return { error: 'Password cannot be empty.' };
    } else if (credentials.username.length < 1) {
      setAlertVisible(true);
      return { error: 'Username must be at least 1 character long.' };
    } else if (credentials.password.length < 1) {
      setAlertVisible(true);
      return { error: 'Password must be at least 1 character long.' };
    } else if (credentials.username.trim() === '') {
      setAlertVisible(true);
      return { error: 'Username cannot be just whitespace.' };
    } else if (credentials.password.trim() === '') {
      setAlertVisible(true);
      return { error: 'Password cannot be just whitespace.' };
    }

    try {
        const user = await props.handleLogin(credentials);
        return { success: true };
    } catch (err) {
        setAlertVisible(true);
        return { error: 'Login failed. Incorrect username or password.' };
    }
  }

  return (
    <>
      <Row className="justify-content-center m-3">
        <Col md={ 4 } className="border rounded p-3">
          <h2 className="text-center mb-3">Login</h2>

          { alertVisible && <Alert variant="danger" onClose={() => setAlertVisible(false)} dismissible>{ state.error }</Alert> }

          <Form action={ formAction }>
            <Form.Group className="mb-3">
              <Form.Label className="fs-5 mb-0">Email</Form.Label>
              <Form.Control name="username" type="email" minLength={ 1 } required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fs-5 mb-0">Password</Form.Label>
              <Form.Control name="password" type="password" minLength={ 1 } required />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button type="submit" variant="primary" disabled={ isPending }>
                Submit
              </Button>
              <Button type="reset" variant="secondary" disabled={ isPending }>
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}

function LoginButton() {
  return (
    <Link 
      to={ '/login' } 
      className="fs-2 pt-1 text-decoration-none bi bi-person-circle d-flex flex-column align-items-center justify-content-center"
    >
      <span className="fs-6">Login</span>
    </Link>
  );
}

function LogoutButton(props) {
  return (
    <Link 
      to={ '/' } 
      className="fs-2 pt-1 text-decoration-none bi bi-box-arrow-left d-flex flex-column align-items-center justify-content-center"
      onClick={ props.handleLogout }
    >
      <span className="fs-6">Logout</span>
    </Link>
  );
}

function ProfileButton() {
  const user = useContext(UserContext)

  return (
    <Link 
      to={ '/profile' } 
      className="fs-2 pt-1 text-decoration-none bi bi-person d-flex flex-column align-items-center justify-content-center"
    >
      <span className="fs-6">{ user.name }</span>
    </Link>
  );
}

export { LoginForm, LoginButton, LogoutButton, ProfileButton };