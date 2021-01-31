import * as React from 'react';
import {
  ErrorMessage,
  Field,
  Form,
  FormikProvider,
  useFormik,
  useFullFormikState,
} from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

type SignInValues = {
  username: string;
  password: string;
};

export const SignInPage = () => {
  const router = useRouter();
  const [errorLog, setErrorLog] = React.useState<any[]>([]);

  const [, formik] = useFormik<SignInValues>({
    validateOnMount: router.query.validateOnMount === 'true',
    validateOnBlur: router.query.validateOnBlur !== 'false',
    validateOnChange: router.query.validateOnChange !== 'false',
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async values => {
      await new Promise(r => setTimeout(r, 500));
      alert(JSON.stringify(values, null, 2));
    },
  });

  const state = useFullFormikState<SignInValues>(formik);

  React.useEffect(() => {
    if (state.errors.username && state.touched.username) {
      setErrorLog(logs => [
        ...logs,
        {
          name: 'username',
          value: state.values.username,
          error: state.errors.username,
        },
      ]);
    }

    if (state.errors.password && state.touched.password) {
      setErrorLog(logs => [
        ...logs,
        {
          name: 'password',
          value: state.values.password,
          error: state.errors.password,
        },
      ]);
    }
  }, [
    state.values.username,
    state.errors.username,
    state.touched.username,
    state.values.password,
    state.errors.password,
    state.touched.password,
  ]);

  return (
    <div>
      <h1>Sign In</h1>
      <FormikProvider value={formik}>
        <Form>
          <div>
            <Field name="username" placeholder="Username" />
            <ErrorMessage name="username" component="p" />
          </div>

          <div>
            <Field name="password" placeholder="Password" type="password" />
            <ErrorMessage name="password" component="p" />
          </div>

          <button type="submit" disabled={!state.isValid}>
            Submit
          </button>

          <button
            type="reset"
            onClick={() => {
              setErrorLog([]);
            }}
          >
            Reset
          </button>

          <pre id="error-log">{JSON.stringify(errorLog, null, 2)}</pre>
        </Form>
      </FormikProvider>
    </div>
  );
};
