import * as React from 'react';
import {
  FormikFormProps,
  useFormikState,
  FormikState,
} from '@mochi-forms/react';
import { useEffect } from 'react';

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

export default FormWithOnChange;
