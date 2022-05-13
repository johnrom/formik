import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import { parseCheckboxArrayFromEvent } from '../helpers/parse-format-helpers';
import { PathMatchingValue } from '../helpers/path-helpers';
import { FormatFn } from '../types';
import { FieldConfigProps } from '../types/field-config-types';

type CheckboxArrayFieldProps<Values, Value> = {
  name: PathMatchingValue<Value[], Values>;
  value: Value;
} & ([Value] extends [React.ComponentProps<'input'>['type']]
  ? {
      format?: FormatFn<Value, React.ComponentProps<'input'>['value']>;
    }
  : {
      format: FormatFn<Value, React.ComponentProps<'input'>['value']>;
    });

export const CheckboxArrayField = <Values, Value>(
  props: Omit<
    FieldConfigProps<Values, Value[], 'input'>,
    'type' | 'value' | 'format' | 'parse' | 'as'
  > &
    CheckboxArrayFieldProps<Values, Value>
) => {
  const { value: stateValue } = useFieldMeta<Values, Value[]>(props.name);
  const { name, format, value: propsValue, ...fieldProps } = props;
  const formattedValue =
    props.format?.(props.value, props.name) ??
    (props.value as unknown as Exclude<
      React.ComponentProps<'input'>['value'],
      undefined
    >);

  return (
    <Field
      name={props.name}
      as="input"
      type="checkbox"
      checked={propsValue in stateValue}
      parse={React.useMemo(
        () => parseCheckboxArrayFromEvent<Values, Value>(props.value),
        [props.value]
      )}
      format={React.useCallback(
        () =>
          props.format?.(props.value, props.name) ??
          (props.value as unknown as Exclude<
            React.ComponentProps<'input'>['value'],
            undefined
          >),
        [props.value, props.name]
      )}
      value={formattedValue}
      {...fieldProps}
    />
  );
};
