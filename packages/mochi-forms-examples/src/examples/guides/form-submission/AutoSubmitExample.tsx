import React from 'react';
import {
  Form,
  Field,
  useFormik,
  FormikSubmitHandler,
  FormikProvider,
} from '@mochi-forms/react';

const initialValues = { token: '' };
const alertOnSubmit: FormikSubmitHandler<
  typeof initialValues
> = async values => {
  alert(JSON.stringify(values, null, 2));
};
const validateToken = (tokenLike: string) =>
  tokenLike.length < 6
    ? 'Invalid Code. Too Short.'
    : tokenLike.length > 6
    ? 'Invalid Code. Too Long.'
    : '';

// @snippet:start useState
export const AutoSubmitExample = () => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: alertOnSubmit,
  });
  const { submitForm } = formik;
  const { values } = formik.useState();
  // @snippet:end useState

  React.useEffect(() => {
    // Submit the form imperatively as an effect as soon as form values.token are 6 digits long
    if (values.token.length === 6) {
      submitForm();
    }
  }, [values, submitForm]);

  return (
    <div>
      <h1>2-step Verification</h1>
      <p>Please enter the 6 digit code sent to your device</p>
      <FormikProvider value={formik}>
        <Form>
          <Field name="token" type="tel" validate={validateToken} />
        </Form>
      </FormikProvider>
    </div>
  );
};

export default AutoSubmitExample;
