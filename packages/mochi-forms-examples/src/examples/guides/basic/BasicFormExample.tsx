import * as React from 'react';
import { Formik, Field, Form } from '@mochi-forms/react';
import { exampleAlertOnSubmit, exampleInitialValues } from './basic-helpers';

const BasicExample = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={exampleInitialValues}
        onSubmit={exampleAlertOnSubmit}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="John" />

          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Doe" />

          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="john@acme.com"
            type="email"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default BasicExample;
