import * as React from 'react';
import {
  Field,
  ErrorMessage,
  FormikFormProps,
  useFormikState,
  FormikState,
  Formik,
} from '@mochi-forms/react';
import { useEffect } from 'react';

const initialValues = {
  email: '',
};

const alertOnSubmit = async <Values,>(values: Values) => {
  alert(JSON.stringify(values, null, 2));
};

interface FormWithOnChangeProps<Values>
  extends Omit<FormikFormProps, 'onChange'> {
  onChange?: (values: Values) => void;
}

// @snippet:start FormWithOnChange
const selectValues = <Values,>(state: FormikState<Values>) => state.values;

const FormWithOnChange = <Values,>({
  onChange,
  ...formProps
}: FormWithOnChangeProps<Values>) => {
  // if onChange is falsy, this value will never update
  const [values, formikApi] = useFormikState<Values, Values>(
    selectValues,
    undefined,
    !!onChange
  );
  const { handleSubmit } = formikApi;

  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);

  return <form {...formProps} onSubmit={handleSubmit} />;
};
// @snippet:end FormWithOnChange

const BasicExample = () => {
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={alertOnSubmit}>
        <FormWithOnChange>
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
        </FormWithOnChange>
      </Formik>
    </div>
  );
};

export default BasicExample;
