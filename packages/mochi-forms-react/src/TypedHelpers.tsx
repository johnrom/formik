import { useMemo } from 'react';
import { Field, FieldComponent, UseFieldFn, useField } from './Field';
import { FieldArray, FieldArrayComponent } from './FieldArray';

export const createTypedHelpers = <Values,>() => ({
  useField: useField as UseFieldFn<Values>,
  Field: Field as FieldComponent<Values>,
  FieldArray: FieldArray as FieldArrayComponent<Values>,
});

export const useTypedHelpers = <Values,>() =>
  useMemo(() => createTypedHelpers<Values>(), []);
