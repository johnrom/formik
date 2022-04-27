import React from 'react';
import { useFormikState, Formik, Field, Form } from '@mochi-forms/react';
import { Debug } from '../helpers/Debug';
import debounce from 'just-debounce-it';

interface AutoSaveProps {
  debounceMs: number;
}

const AutoSave = ({ debounceMs }: AutoSaveProps) => {
  const [{ isSubmitting, values }, { submitForm }] = useFormikState();
  const [lastSaved, setLastSaved] = React.useState<string | null>(null);
  const debouncedSubmit = React.useCallback(
    debounce(
      () => submitForm().then(() => setLastSaved(new Date().toISOString())),
      debounceMs
    ),
    [debounceMs, submitForm]
  );

  React.useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, values]);

  return (
    <>
      {!!isSubmitting
        ? 'saving...'
        : lastSaved !== null
        ? `Last Saved: ${lastSaved}`
        : null}
    </>
  );
};

const DebouncedAutoSaveExample = () => (
  <div>
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        return new Promise(resolve =>
          setTimeout(() => {
            console.log('submitted', JSON.stringify(values, null, 2));
            setSubmitting(false);
            resolve();
          }, 1000)
        );
      }}
    >
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

        <label htmlFor="email">Email</label>
        <Field name="email" placeholder="jane@acme.com" type="email" />
        <button type="submit">Submit</button>

        <Debug />
      </Form>
    </Formik>
  </div>
);

export default DebouncedAutoSaveExample;
