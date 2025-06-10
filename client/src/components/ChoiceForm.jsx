import { useActionState } from "react";
import { Button, Form } from "react-bootstrap";

function ChoiceForm(props) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {});

  async function handleSubmit(prevState, formData) {
    return { success: true };
  };

  return (
    <>
      <Form action={ formAction }>
          <Form.Group className="mb-1">
            <Form.Select name="interval" required>
                { 1 }
            </Form.Select>
          </Form.Group>

          <Button className="me-2" variant="primary">
              Submit
          </Button>
          <Button variant="danger" type="reset">
              Cancel
          </Button>
      </Form>
    </>
  );
}

export { ChoiceForm };