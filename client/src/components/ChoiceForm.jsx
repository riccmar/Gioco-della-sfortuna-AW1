import { useActionState } from "react";
import { Button, Form } from "react-bootstrap";

function calculateOptions(rates) {
  const options = [];
  const sortedRates = [...rates];
  let i = 0;

  sortedRates.sort((a, b) => a - b);

  for (i; i < sortedRates.length - 1; i++) {
    if (i === 0) {
      if (sortedRates[i] !== 1) {
        options.push(<option key={ 0 } value={ `1 - ${ sortedRates[i] }` }>{ `1 - ${ sortedRates[i] }` }</option>);
      }  
    }
    options.push(<option key={ i } value={ `${ sortedRates[i] } - ${ sortedRates[i + 1] }` }>{ `${ sortedRates[i] } - ${ sortedRates[i + 1] }` }</option>);
  }
  options.push(<option key={ i } value={ `${ sortedRates[i] } - 100` }>{ `${ sortedRates[i] } - 100` }</option>);

  return options;
}

function ChoiceForm(props) {
  const [state, formAction, isPending] = useActionState(handleSubmit, {});

  async function handleSubmit(prevState, formData) {
    const choice = formData.get('interval');

    if (choice === null || choice === undefined) {
      return { error: 'Interval choice is required.' };
    }

    return { success: true };
  };

  const options = calculateOptions(props.rates);

  return (
    <>
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