import * as React from 'react';
import { LegacyField, Form, FormikProvider } from '@mochi-forms/react';
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
          <LegacyField id="firstName" name="firstName" placeholder="John" />

          <label htmlFor="lastName">Last Name</label>
          <LegacyField id="lastName" name="lastName" placeholder="Doe" />

          <label htmlFor="email">Email</label>
          <LegacyField
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
