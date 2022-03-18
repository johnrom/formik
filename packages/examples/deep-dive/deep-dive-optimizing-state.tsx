import * as React from 'react';
import {
  Field,
  ErrorMessage,
  FormikFormProps,
  FormikProvider,
  useFormik,
  useFormikState,
  FormikState,
} from 'formik';
import { useEffect } from 'react';
import _ from 'lodash';

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: '',
};

const alertOnSubmit = async <Values,>(values: Values) => {
  alert(JSON.stringify(values, null, 2));
};

// @snippet:start useFormikState
type FormikChangeHandler<Values> = (values: Values) => void;
interface WithFormikChangeHandlerProp<Values> {
  onChange?: FormikChangeHandler<Values>;
}

type FormWithOnChangeProps<Values> = Omit<FormikFormProps, 'onChange'> & WithFormikChangeHandlerProp<Values>;

// @snippet:start selector
const selectValues = <Values,>(state: FormikState<Values>) => state.values;
// @snippet:end selector

const FormWithOnChange = <Values,>({ onChange, ...formProps }: FormWithOnChangeProps<Values>) => {
  // if onChange is falsy, this component will not rerender when this subscription changes
  const [values, formikApi] = useFormikState<Values, Values>(selectValues, Object.is, !!onChange);
  const { handleSubmit } = formikApi;

  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [onChange, values]);
  // @snippet:end useFormikState

  return <form {...formProps} onSubmit={handleSubmit} />;
};

// @snippet:start deep-comparison
const FormWithOnChangeDeepComparison = <Values,>({ onChange, ...formProps }: FormWithOnChangeProps<Values>) => {
  // updates will only trigger renders when the deep comparison is different
  const [values, formikApi] = useFormikState<Values, Values>(selectValues, _.isEqual, !!onChange);
  // @snippet:end deep-comparison
  const { handleSubmit } = formikApi;

  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [onChange, values]);

  return <form {...formProps} onSubmit={handleSubmit} />;
};

// @snippet:start formik-useState
const TutorialOptimizingStateExample = () => {
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: alertOnSubmit,
  });
  // @snippet:start selector-memoized
  const selectValuesOptimized = React.useCallback((state: FormikState<FormValues>) => {
    return state.values;
  }, []);
  // @snippet:end selector-memoized
  const values = formik.useState(selectValuesOptimized);

  const onChange = React.useCallback((values: FormValues) => {
    console.log('values were updated: ', values);
  }, []);

  useEffect(() => {
    onChange(values);
  }, [values]);
  // @snippet:end formik-useState

  return (
    <div>
      <FormikProvider value={formik}>
        {
          // @snippet:start using-form-onChange
        }
        <FormWithOnChange onChange={onChange}>
          {
            // @snippet:end using-form-onChange
          }
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
        </FormWithOnChange>
      </FormikProvider>
    </div>
  );
};

export default TutorialOptimizingStateExample;
