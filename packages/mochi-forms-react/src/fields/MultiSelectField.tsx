import * as React from 'react';
import { Field } from '../Field';
import { noopFormatFn } from '../helpers/parse-format-helpers';
import { FormatFn, FormikValues } from '../types';
import {
  FieldConfigFormatProp,
  FieldConfigPropsByValue,
} from '../types/field-config-types';

export const parseMultiSelectValueFromEvent = (
  event: React.ChangeEvent<HTMLSelectElement>
) => Array.from(event.target.selectedOptions, option => option.value);

export type MultiSelectFieldProps<Value> = FieldConfigFormatProp<
  Value[],
  readonly string[]
>;

const defaultMultiSelectParseFn = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  return parseMultiSelectValueFromEvent(event);
};

/**
 * Multi select field is a special case where the value passed to `select.value` is an array, and each item needs to be parsed.
 *
 * Actually, we should go back and lighten this field up and make the parse and format both deal with the complete array.
 */
export const MultiSelectField = <Values extends FormikValues, Value>(
  props: Omit<
    FieldConfigPropsByValue<Values, Value[], 'select'>,
    'type' | 'value' | 'format' | 'as'
  > &
    MultiSelectFieldProps<Value>
) => {
  const { name, format, parse, ...fieldProps } = props;

  return (
    <Field<Values, Value[], 'select'>
      {...fieldProps}
      multiple={true}
      name={name}
      as="select"
      parse={parse ?? defaultMultiSelectParseFn}
      // todo: format doesn't correctly infer its value
      format={(format as FormatFn<Value[], readonly string[]>) ?? noopFormatFn}
    />
  );
};
