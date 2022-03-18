import * as React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { exampleInitialValues, exampleOnSubmit } from '../helpers/basic-helpers';

const BasicExample = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={exampleInitialValues}
        onSubmit={exampleOnSubmit}
      >
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              placeholder="john@acme.com"
              type="email"
              validate={(emailLike: string) => {
                if (!emailLike) {
                  return 'Required';
                }
                return '';
              }}
            />
            <ErrorMessage name="email" component="div" />
          </div>

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default BasicExample;
