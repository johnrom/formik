import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import {
  noopFormatFn,
  parseCheckboxArrayFromEvent,
} from '../helpers/parse-format-helpers';
import { PathMatchingValue } from '../helpers/path-helpers';
import { useEventCallback } from '../hooks/useEventCallback';
import { FormatFn, FormikValues, ParseFn } from '../types';
import {
  FieldConfigFormatProp,
  FieldConfigProps,
} from '../types/field-config-types';

type CheckboxArrayFieldProps<Values extends FormikValues, Value> = {
  name: PathMatchingValue<Value[], Values>;
  value: Value;
} & FieldConfigFormatProp<Value, React.ComponentProps<'input'>['value']>;

/**
 * CheckboxArrayField is a special case where:
 * - The `name` prop is `PathMatchingValue<Value[], Values>`,
 * - The `value` prop is a single `Value`, and
 * - The `format` prop converts a single `Value` to `typeof input.value`
 */
export const CheckboxArrayField = <Values, Value>(
  props: Omit<
    FieldConfigProps<Values, Value[], 'input'>,
    'value' | 'format' | 'as'
  > &
    CheckboxArrayFieldProps<Values, Value>
) => {
  const { value: stateValue } = useFieldMeta<Values, Value[]>(props.name);
  const { format, parse: propsParse, value: propsValue, ...fieldProps } = props;

  const defaultParse = useEventCallback<
    ParseFn<Values, Value[], React.ChangeEvent<HTMLInputElement>>
  >((event, name, helpers) =>
    parseCheckboxArrayFromEvent<Values, Value>(props.value)(
      event,
      name,
      helpers
    )
  );

  const singleValueFormatter = React.useCallback<
    FormatFn<Value[], React.ComponentProps<'input'>['value']>
  >(
    () => (format ? format(propsValue, props.name) : noopFormatFn(propsValue)),
    [propsValue, format]
  );

  return (
    <Field
      as="input"
      type={props.type ?? 'checkbox'}
      checked={propsValue in stateValue}
      parse={propsParse ?? defaultParse}
      format={singleValueFormatter}
      {...fieldProps}
    />
  );
};
