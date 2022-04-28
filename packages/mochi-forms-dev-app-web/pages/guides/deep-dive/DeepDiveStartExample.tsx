import * as React from 'react';
import { Formik, Field, Form, ErrorMessage } from '@mochi-forms/react';

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: '',
};

const alertOnSubmit = async <Values,>(values: Values) => {
  alert(JSON.stringify(values, null, 2));
};

const BasicExample = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik initialValues={initialValues} onSubmit={alertOnSubmit}>
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
