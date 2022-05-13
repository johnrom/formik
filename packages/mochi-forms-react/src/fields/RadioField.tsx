import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import { parseRadioValueFromEvent } from '../helpers/parse-format-helpers';
import { FieldConfigPropsByValue } from '../types/field-config-types';

type RadioFieldProps<Value> = {
  value: Value;
};

/**
 * Radio field is a special case where the value passed to `value` gets formatted,
 * instead of the value in state.
 *
 * When selected, the `value` passed to `value` gets chosen instead of `event.target.value`.
 */
export const RadioField = <Values, Value>(
  props: Omit<
    FieldConfigPropsByValue<Values, Value, 'input'>,
    'type' | 'value' | 'parse' | 'as'
  > &
    RadioFieldProps<Value>
) => {
  const { name, value: propsValue, format, ...fieldProps } = props;
  const { value: stateValue } = useFieldMeta<Values, Value>(props.name);

  return (
    <Field<Values, Value, 'input'>
      {...fieldProps}
      name={name}
      as="input"
      type="radio"
      checked={propsValue === stateValue}
      parse={React.useMemo(
        () => parseRadioValueFromEvent(propsValue),
        [propsValue]
      )}
      format={React.useCallback(
        () => (format ? format(propsValue, name) : (propsValue as any)),
        [props.format, propsValue]
      )}
    />
  );
};
