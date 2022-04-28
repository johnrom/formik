import React from 'react';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
} from '@mochi-forms/react';
import { Debug } from '../helpers/Debug';

const initialValues = {
  email: '',
  password: '',
};

const validate = (values: typeof initialValues) => {
  const errors: FormikErrors<typeof initialValues> = {};
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  return errors;
};

const SyncValidationExample = () => (
  <div>
    <h1>Sign In</h1>
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={values => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        }, 500);
      }}
    >
      <Form>
        <label htmlFor="email">Email</label>
        <Field name="email" placeholder="john@acme.com" type="email" />
        <div className="field-error">
          <ErrorMessage name="email" />
        </div>
        <label htmlFor="password">Password</label>
        <Field name="password" type="password" />
        <button type="submit">Sign In</button>
        <Debug />
      </Form>
    </Formik>
  </div>
);

export default SyncValidationExample;
