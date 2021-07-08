// @snippet:start your-first-field
import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';

const MyForm = () => (
  <div>
    <h1>Contact Us</h1>
    <Formik
      initialValues={{
        message: '',
      }}
      onSubmit={async values => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <Field name="message" placeholder="Let us know what you think..." />
        <ErrorMessage name="message" />
      </Form>
    </Formik>
  </div>
);
// @snippet:end your-first-field

export default MyForm;
