import * as React from 'react';
import {
  Field,
  ErrorMessage,
  FormikConfig,
  FormikFormProps,
  FormikProvider,
  useFormik,
  useFormikContext,
} from 'formik';

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: '',
};

const alertOnSubmit = async <Values,>(values: Values) => {
  alert(JSON.stringify(values, null, 2));
};

// @snippet:start use-formik-hooks
const MyFormik = <Values,>({
  children,
  ...formikprops
}: FormikConfig<Values>) => {
  const formik = useFormik(formikprops);

  return <FormikProvider value={formik}>{children}</FormikProvider>;
};

// @snippet:start useFormikContext
const MyForm = (props: FormikFormProps) => {
  const { handleSubmit } = useFormikContext();

  return <form onSubmit={handleSubmit} {...props} />;
};
// @snippet:end useFormikContext

const BasicExample = () => {
  return (
    <div>
      <MyFormik
        initialValues={initialValues}
        onSubmit={alertOnSubmit}
      >
        <MyForm>
          <div>
            {
              // @snippet:end use-formik-hooks
            }
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
      </MyFormik>
    </div>
  );
};

export default BasicExample;
