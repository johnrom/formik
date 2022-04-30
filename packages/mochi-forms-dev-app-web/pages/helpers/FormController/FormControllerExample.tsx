import * as React from 'react';
import { Formik, LegacyField, Form } from '@mochi-forms/react';
import {
  exampleOnSubmit,
  exampleInitialValues,
} from '../../../helpers/example-helpers';

const FormControllerExample = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik initialValues={exampleInitialValues} onSubmit={exampleOnSubmit}>
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
      </Formik>
    </div>
  );
};

export default FormControllerExample;
