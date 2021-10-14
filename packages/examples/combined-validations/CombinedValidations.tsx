import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Debug } from '../Debug';
import { sleep } from '../helpers';

const initialValues = {
  username: '',
  email: '',
  zip: '',
};

const Schema = Yup.object().shape({
  email: Yup.string().required('This field is required'),
});

const validate = (values: typeof initialValues) =>
  sleep(300).then(() => {
    return {
      zip: 'This field is required',
    };
  });

const isRequired = (message: string) => <Value,>(value: Value) =>
  !!value ? undefined : message;

const CombinedValidationsExample = () => (
  <div>
    <h1>Pick a username</h1>
    <Formik
      validationSchema={Schema}
      validate={validate}
      initialValues={initialValues}
      onSubmit={values => {
        sleep(500).then(() => {
          alert(JSON.stringify(values, null, 2));
        });
      }}
    >
      <Form>
        <label htmlFor="username">Username</label>
        <div>
          <Field
            name="username"
            validate={isRequired('This field is required')}
            type="text"
            placeholder="username"
          />
          <ErrorMessage name="username" />
        </div>
        <br />
        <div>
          <Field
            name="email"
            validate={isRequired('This field is required')}
            type="text"
            placeholder="email"
          />
          <ErrorMessage name="email" />
        </div>
        <br />
        <div>
          <Field
            name="zip"
            validate={isRequired('This field is required')}
            type="text"
            placeholder="zip"
          />
          <ErrorMessage name="zip" />
        </div>
        <br />
        <button type="submit">Submit</button>
        <Debug />
      </Form>
    </Formik>
  </div>
);

export default CombinedValidationsExample;
