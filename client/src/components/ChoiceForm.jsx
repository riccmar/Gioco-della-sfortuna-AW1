import { useActionState, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

import { useParams } from "react-router";

import { API } from "../API/api.mjs";

function ChoiceForm(props) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {});
  const [options, setOptions] = useState([]);
  const { gameId } = useParams();

  async function handleSubmit(prevState, formData) {
    const choice = formData.get('interval');

    if (choice === null || choice === undefined) {
      choice.error = 'Interval choice is required.';
      return choice;
    }

    await props.endRound(choice);

    return { success: true };
  };

  useEffect(() => {
    async function takeOptions() {
      const opts = await API.getOptions(props.round, gameId);
      setOptions(opts);
    }

    takeOptions();
  }, []);

  return (
    <>
      { state.error && <Alert variant="danger" className="mb-1">{ state.error }</Alert>}

      { isPending && <Alert variant="warning" className="mb-1">Please, wait for the server's response...</Alert> }

      <Form action={ formAction }>
        <Form.Group className="d-flex justify-content-between align-items-center" >
          <h4 className="mb-0 me-3">Interval: </h4>

          <Form.Select name="interval" required>
              { 
                options.map((option, i) => 
                  <option key={ i } value={ option }>
                    { option }
                  </option>
                ) 
              }
          </Form.Select>
        </Form.Group>
        

        <Button variant="success" type="submit" className="w-100 mt-2" disabled={ isPending }>
            Submit
        </Button>
      </Form>
    </>
  );
}

export { ChoiceForm };