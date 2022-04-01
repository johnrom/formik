import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
} from '@mochi-forms/react';
import * as Yup from 'yup';
import { DebugProps } from '../../components/debugging/DebugProps';
import {
  alertOnSubmit,
  BasicPizzaPartyFormValues,
} from '../../helpers/example-helpers';

const Schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required.'),
});

const validate = (values: BasicPizzaPartyFormValues) => {
  const errors: FormikErrors<BasicPizzaPartyFormValues> = {};

  if (!values.lastName) {
    errors.lastName = 'Last name is required.';
  }

  return errors;
};

const FieldLevelValidation = () => (
  <div>
    <h1>Pick a username</h1>
    <Formik<BasicPizzaPartyFormValues>
      validationSchema={Schema}
      validate={validate}
      initialValues={{
        firstName: '',
        lastName: '',
        numberOfPizzas: 1,
      }}
      onSubmit={alertOnSubmit}
      render={(props) => (
        <Form>
          <div>
            <label htmlFor="firstName">First Name</label>
            <Field name="firstName" type="text" placeholder="firstName" />
            <ErrorMessage name="firstName" />
          </div>
          <br />
          <div>
            <label htmlFor="lastName">Last Name</label>
            <Field name="lastName" type="text" placeholder="lastName" />
            <ErrorMessage name="lastName" />
          </div>
          <div>
            <label htmlFor="numberOfPizzas">Number of Pizzas</label>
            <Field
              name="numberOfPizzas"
              validate={(value: unknown) =>
                Number(value) < 1 ? 'Please select at least one pizza.' : ''
              }
              type="number"
            />
            <ErrorMessage name="numberOfPizzas" />
          </div>
          <button type="submit">Submit</button>

          <DebugProps props={props} />
        </Form>
      )}
    />
  </div>
);

export default FieldLevelValidation;
