import { useFormikContext, Formik, Field, Form } from '@mochi-forms/react';
import debounce from 'just-debounce-it';
import { useState, useCallback, useEffect, FunctionComponent } from 'react';
import { DebugProps } from '../../components/debugging/DebugProps';
import { basicPizzaPartyInitialValues } from '../../helpers/example-helpers';

interface AutoSaveProps {
  debounceMs: number;
}

const AutoSave: FunctionComponent<AutoSaveProps> = ({ debounceMs }) => {
  const formik = useFormikContext();
  const [lastSaved, setLastSaved] = useState<null | string>(null);
  const debouncedSubmit = useCallback(
    debounce(
      () =>
        formik.submitForm().then(() => setLastSaved(new Date().toISOString())),
      debounceMs
    ),
    [debounceMs, formik.submitForm]
  );

  useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, formik.values]);

  return (
    <>
      {!!formik.isSubmitting
        ? 'saving...'
        : lastSaved !== null
        ? `Last Saved: ${lastSaved}`
        : null}
    </>
  );
};

const AutoSavingForm = () => (
  <div>
    <Formik
      initialValues={basicPizzaPartyInitialValues}
      onSubmit={(values, { setSubmitting }) => {
        return new Promise<void>((resolve) =>
          setTimeout(() => {
            console.log('submitted', JSON.stringify(values, null, 2));
            setSubmitting(false);
            resolve();
          }, 1000)
        );
      }}
      render={(props) => (
        <Form>
          <h1>
            AutoSavingForm{' '}
            <small style={{ color: 'gray', fontSize: 11 }}>
              <AutoSave debounceMs={300} />
            </small>
          </h1>

          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" placeholder="Jane" />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" placeholder="Doe" />

          <label htmlFor="numberOfPizzas">Number of Pizzas</label>
          <Field name="numberOfPizzas" type="number" />

          <button type="submit">Submit</button>

          <DebugProps props={props} />
        </Form>
      )}
    />
  </div>
);

export default AutoSavingForm;
