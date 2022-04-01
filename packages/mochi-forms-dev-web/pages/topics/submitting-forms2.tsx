import { Field, Form, Formik } from '@mochi-forms/react';
import type { NextPage } from 'next';
import {
  BasicPizzaPartyFormValues,
  basicPizzaPartyInitialValues,
} from '../../helpers/example-helpers';

/**
 * This example demonstrates how to use async/await to submit a form.
 * Here, we create a pretend Promise to await that will return in 200ms.
 */
export const asyncOnSubmit = async (values: BasicPizzaPartyFormValues) => {
  await new Promise((resolve) => {
    alert(JSON.stringify(values, null, 2));

    setTimeout(resolve, 200);
  });
};

const AsyncSubmissionPage: NextPage = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={basicPizzaPartyInitialValues}
      onSubmit={asyncOnSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" placeholder="Jane" />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" placeholder="Doe" />

          <label htmlFor="numberOfPizzas">Number of Pizzas</label>
          <Field name="numberOfPizzas" type="number" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default AsyncSubmissionPage;
