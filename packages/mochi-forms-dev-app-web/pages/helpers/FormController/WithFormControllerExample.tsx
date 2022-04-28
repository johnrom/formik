import * as React from 'react';
import { Field, Form, withFormik } from '@mochi-forms/react';
import {
  exampleOnSubmit,
  exampleInitialValues,
} from '../../../helpers/example-helpers';

const MyForm = withFormik({
  mapPropsToValues: () => exampleInitialValues,
  handleSubmit: exampleOnSubmit,
})(() => (
  <Form>
    <label htmlFor="firstName">First Name</label>
    <Field id="firstName" name="firstName" placeholder="John" />

    <label htmlFor="lastName">Last Name</label>
    <Field id="lastName" name="lastName" placeholder="Doe" />

    <label htmlFor="email">Email</label>
    <Field id="email" name="email" placeholder="john@acme.com" type="email" />

    <button type="submit">Submit</button>
  </Form>
));

const WithFormControllerExample = () => {
  return (
    <div>
      <h1>Signup</h1>
      <MyForm />
    </div>
  );
};

export default WithFormControllerExample;
