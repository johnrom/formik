import * as React from 'react';
import { Field, Form, FormikProvider } from '@mochi-forms/react';
import {
  exampleOnSubmit,
  exampleInitialValues,
} from '../../../helpers/example-helpers';
import { useFormik } from '@mochi-forms/react';

const UseFormControllerExample = () => {
  const form = useFormik({
    initialValues: exampleInitialValues,
    onSubmit: exampleOnSubmit,
  });

  return (
    <div>
      <h1>Signup</h1>
      <FormikProvider value={form}>
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
      </FormikProvider>
    </div>
  );
};

export default UseFormControllerExample;
