import * as React from 'react';
import {
  LegacyField,
  ErrorMessage,
  FormikFormProps,
  FormikProvider,
  useFormik,
  useFormikState,
} from '@mochi-forms/react';
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
const DeepDiveFormikApiUseStateExample = () => {
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
            <LegacyField
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

export default DeepDiveFormikApiUseStateExample;
