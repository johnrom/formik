import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
} from '@mochi-forms/react';
import {
  alertOnSubmit,
  BasicPizzaPartyFormValues,
  basicPizzaPartyInitialValues,
  sleep,
} from '../../helpers/example-helpers';
import { DebugProps } from '../../components/debugging/DebugProps';
import type { NextPage } from 'next';

const validateAsync = (values: BasicPizzaPartyFormValues) => {
  return sleep(300).then(() => {
    const errors: FormikErrors<BasicPizzaPartyFormValues> = {};

    if (['admin', 'null', 'god'].includes(values.firstName)) {
      errors.firstName = 'Nice try';
    }

    if (!values.firstName) {
      errors.firstName = 'Required';
    }

    if (Object.keys(errors).length) {
      throw errors;
    }
  });
};

const AsyncValidationPage: NextPage = () => (
  <div>
    <h1>Pick a username</h1>
    <Formik
      initialValues={basicPizzaPartyInitialValues}
      validate={validateAsync}
      onSubmit={alertOnSubmit}
      render={(props) => (
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
          <DebugProps props={props} />
        </Form>
      )}
    />
  </div>
);

export default AsyncValidationPage;
