import { Formik, Field, Form, ErrorMessage } from '@mochi-forms/react';
import type { NextPage } from 'next';
import { alertOnSubmit } from '../../helpers/example-helpers';

const BasicFormPage: NextPage = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={alertOnSubmit}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" placeholder="Jane" />
          <ErrorMessage name="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" placeholder="Doe" />
          <ErrorMessage name="lastName" />

          <label htmlFor="numberOfPizzas">Number of Pizzas</label>
          <Field name="numberOfPizzas" type="number" />
          <ErrorMessage name="numberOfPizzas" />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default BasicFormPage;
