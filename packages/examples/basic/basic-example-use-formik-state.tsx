import * as React from 'react';
import {
  Field,
  ErrorMessage,
  FormikConfig,
  FormikFormProps,
  FormikProvider,
  useFormik,
  useFormikContext,
  useFormikState,
  FormikState,
} from 'formik';
import { useEffect } from 'react';

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: '',
};

const alertOnSubmit = async <Values,>(values: Values) => {
  alert(JSON.stringify(values, null, 2));
};

const MyFormik = <Values,>({
  children,
  ...formikprops
}: FormikConfig<Values>) => {
  const formik = useFormik(formikprops);

  return <FormikProvider value={formik}>{children}</FormikProvider>;
};

const MyForm = ({ onChange, ...formProps }: FormikFormProps) => {
  const [state, formikApi] = useFormikState();
  const { handleSubmit } = formikApi;

  useEffect(() => {
    console.log('state was updated: ', state);
  }, [state]);

  return <form {...formProps} onSubmit={handleSubmit} />;
};
// @snippet:end useFormikState

// @snippet:start useApiState
const BasicExample = () => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: alertOnSubmit,
  });
  const state = formik.useState();

  useEffect(() => {
    console.log('state was updated: ', state);
  }, [state]);

  return (
    <div>
      <FormikProvider value={formik}>
        {
          // @snippet:end useApiState
        }
        <MyForm>
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
        </MyForm>
      </FormikProvider>
    </div>
  );
};

export default BasicExample;
