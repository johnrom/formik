import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import {
  noopFormatFn,
  parseRadioValueFromEvent,
} from '../helpers/parse-format-helpers';
import { useEventCallback } from '../hooks/useEventCallback';
import { ParseFn } from '../types';
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
    'type' | 'value' | 'as'
  > &
    RadioFieldProps<Value>
) => {
  const {
    name,
    value: propsValue,
    format,
    parse: propsParse,
    ...fieldProps
  } = props;
  const { value: stateValue } = useFieldMeta<Values, Value>(props.name);

  const parse = useEventCallback<
    ParseFn<Values, Value, React.ChangeEvent<HTMLInputElement>>
  >((event, name, helpers) =>
    propsParse
      ? propsParse(event, name, helpers)
      : parseRadioValueFromEvent<Values, Value>(propsValue)(
          event,
          name,
          helpers
        )
  );

  return (
    <Field<Values, Value, 'input'>
      {...fieldProps}
      name={name}
      as="input"
      type="radio"
      checked={propsValue === stateValue}
      parse={parse}
      format={format ?? noopFormatFn}
    />
  );
};
