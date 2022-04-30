import * as React from 'react';
import {
  LegacyField,
  ErrorMessage,
  FormikConfig,
  FormikFormProps,
  FormikProvider,
  useFormik,
  useFormikContext,
} from '@mochi-forms/react';

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

// @snippet:start getState
const MyForm = (props: FormikFormProps) => {
  const { getState } = useFormikContext();

  return <form onSubmit={() => alertOnSubmit(getState().values)} {...props} />;
};
// @snippet:end getState

const BasicExample = () => {
  return (
    <div>
      <MyFormik initialValues={initialValues} onSubmit={alertOnSubmit}>
        <MyForm>
          <div>
            {
              // @snippet:end use-formik-hooks
            }
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
      </MyFormik>
    </div>
  );
};

export default BasicExample;
