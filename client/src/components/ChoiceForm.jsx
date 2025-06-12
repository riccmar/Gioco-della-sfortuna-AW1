import { useActionState, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

function calculateOptions(rates) {
  const options = [];
  const sortedRates = [...rates];

  sortedRates.sort((a, b) => a - b);

  if (sortedRates[0] !== 1)
    options.push(<option key={ options.length } value={ `1 - ${ sortedRates[0] }` }>{ `1 - ${ sortedRates[0] }` }</option>);
  for (let i = 0; i < sortedRates.length - 1; i++) {
    options.push(<option key={ options.length } value={ `${ sortedRates[i] } - ${ sortedRates[i + 1] }` }>{ `${ sortedRates[i] } - ${ sortedRates[i + 1] }` }</option>);
  }
  options.push(<option key={ options.length } value={ `${ sortedRates[sortedRates.length - 1] } - 100` }>{ `${ sortedRates[sortedRates.length - 1] } - 100` }</option>);

  return options;
}

function ChoiceForm(props) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {});
  const [options, setOptions] = useState([]);

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
    setOptions(calculateOptions(props.rates));
  }, [props.rates.length]);

  return (
    <>
      { state.error && <Alert variant="danger" className="mb-1">{ state.error }</Alert>}

      { isPending && <Alert variant="warning" className="mb-1">Please, wait for the server's response...</Alert> }

      <Form action={ formAction }>
        <Form.Group className="d-flex justify-content-between align-items-center" >
          <h4 className="mb-0 me-3">Interval: </h4>

          <Form.Select name="interval" required>
              { options }
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