import * as React from 'react';
import { Field } from '../Field';
import { FormatFn, FormikValues, ParseFn } from '../types';
import { FieldConfigPropsByValue } from '../types/field-config-types';

export const parseMultiSelectValueFromEvent = (
  event: React.ChangeEvent<HTMLSelectElement>
) => Array.from(event.target.selectedOptions, option => option.value);

export type MultiSelectParseFn<Values extends FormikValues, Value> = [
  React.ComponentProps<'option'>['value']
] extends [Value]
  ? {
      parse?: ParseFn<Values, Value[], string[]>;
    }
  : {
      parse: ParseFn<Values, Value[], string[]>;
    };

export type MultiSelectFormatFn<Value> = [Value] extends [
  React.ComponentProps<'input'>['type']
]
  ? {
      format?: FormatFn<Value[], string[]>;
    }
  : {
      format: FormatFn<Value[], string[]>;
    };

export type MultiSelectFieldProps<
  Values extends FormikValues,
  Value
> = MultiSelectParseFn<Values, Value> & MultiSelectFormatFn<Value>;

/**
 * Multi select field is a special case where the value passed to `select.value` is an array, and each item needs to be parsed.
 *
 * Actually, we should go back and lighten this field up and make the parse and format both deal with the complete array.
 */
export const MultiSelectField = <Values, Value>(
  props: Omit<
    FieldConfigPropsByValue<Values, Value[], 'select'>,
    'type' | 'value' | 'parse' | 'format' | 'as'
  > &
    MultiSelectFieldProps<Values, Value>
) => {
  const { name, format, parse: propsParse, ...fieldProps } = props;

  const parse = React.useCallback<
    ParseFn<Values, Value[], React.ChangeEvent<HTMLSelectElement>>
  >(
    (event, name, helpers) => {
      const valuesFromEvent = parseMultiSelectValueFromEvent(event);

      return propsParse
        ? propsParse(valuesFromEvent, name, helpers)
        : (valuesFromEvent as any);
    },
    [propsParse]
  );

  return (
    <Field<Values, Value[], 'select'>
      {...fieldProps}
      name={name}
      as="select"
      parse={parse}
      // todo: format should be assignable directly to props.format.
      format={(value: Value[]) =>
        format ? format(value, name) : (value as any)
      }
    />
  );
};
