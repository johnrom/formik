import React from 'react';
import { Formik, Field, Form, ErrorMessage, FormikErrors } from '@johnrom/formik-v3';
import { Debug } from '../Debug';
import { sleep } from '../helpers';

const initialValues = {
  username: '',
};

const validate = (values: typeof initialValues) => {
  return sleep(300).then(() => {
    const errors: FormikErrors<typeof initialValues> = {};

    if (['admin', 'null', 'god'].includes(values.username)) {
      errors.username = 'Nice try';
    }

    if (!values.username) {
      errors.username = 'Required';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  });
};

const AsyncValidationExample = () => (
  <div>
    <h1>Pick a username</h1>
    <Formik
      initialValues={{
        username: '',
      }}
      validate={validate}
      onSubmit={values => {
        sleep(500).then(() => {
          alert(JSON.stringify(values, null, 2));
        });
      }}
    >
      <Form>
        <label htmlFor="username">Username</label>
        <Field name="username" type="text" />
        <ErrorMessage name="username" />
        <button type="submit">Submit</button>
        <Debug />
      </Form>
    </Formik>
  </div>
);

export default AsyncValidationExample;
