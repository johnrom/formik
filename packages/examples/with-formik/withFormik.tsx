import { ErrorMessage, Field, Form, FormikProps, withFormik } from '@johnrom/formik-v3';
import React from 'react';
import * as Yup from 'yup';
import { Debug } from '../Debug';

interface FormValues {
  email: string;
}

interface User {
  email: string;
}

interface FormProps {
  user: User;
}

const formikEnhancer = withFormik<FormProps, FormValues>({
  mapPropsToValues: props => ({ email: props.user.email }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'MyForm', // helps with React DevTools
});

const MyForm = <Values,>(props: FormikProps<Values>) => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;
  return (
    <Form>
      <label htmlFor="email">Email</label>
      <Field name="email" placeholder="jane@acme.com" type="email" />
      <div>
        <ErrorMessage name="email" />
      </div>
      <button
        type="button"
        className="outline"
        onClick={handleReset}
        disabled={!dirty || isSubmitting}
      >
        Reset
      </button>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      <Debug />
    </Form>
  );
};

const EnhancedForm = formikEnhancer(MyForm);

const WithFormikExample = () => (
  <div>
    <EnhancedForm user={{ email: '' }} />
  </div>
);

export default WithFormikExample;
