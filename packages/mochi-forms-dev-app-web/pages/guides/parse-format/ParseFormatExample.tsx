import React from 'react';
import { Formik, Field, Form } from '@mochi-forms/react';
import { sleep } from '../helpers';

const ParseFormatExample = () => {
  return (
    <div>
      <Formik
        initialValues={{
          username: '',
        }}
        onSubmit={async values => {
          await sleep(500);
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ values }) => (
          <Form>
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              name="username"
              parse={(value: unknown) =>
                typeof value === 'string' ? value.toUpperCase() : ''
              }
              format={(value: string) => (value ? value.toLowerCase() : '')}
            />

            <button type="submit">Submit</button>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ParseFormatExample;
