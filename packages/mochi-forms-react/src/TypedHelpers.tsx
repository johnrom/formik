import { useMemo } from 'react';
import { Field, FieldComponent, UseFieldFn, useField } from './Field';
import {
  FieldArray,
  FieldArrayComponent,
  useFieldArray,
  UseFieldArrayFn,
} from './FieldArray';
import { FormikValues } from './types';

export const getTypedHelpers = <Values extends FormikValues>() => ({
  TypedField: Field as FieldComponent<Values>,
  useTypedField: useField as UseFieldFn<Values>,
  TypedFieldArray: FieldArray as FieldArrayComponent<Values>,
  useTypedFieldArray: useFieldArray as UseFieldArrayFn<Values>,
});

export const useTypedHelpers = <Values extends FormikValues>() =>
  useMemo(() => getTypedHelpers<Values>(), []);
