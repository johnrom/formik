import * as React from 'react';
import { Field } from '../Field';
import { useFieldMeta } from '../FieldMeta';
import {
  formatUndefinedFn,
  parseCheckboxBooleanFromEvent,
} from '../helpers/parse-format-helpers';
import { FieldConfigPropsByValue } from '../types/field-config-types';

/**
 * Boolean checkbox is a special case where the input does not get passed a `value`.
 *
 * Instead, it gets passed a value for `checked`.
 *
 * Also, when parsing the value doesn't come from `event.target.value`, but `event.target.checked`.
 */
export const CheckboxBooleanField = <Values,>(
  props: Omit<
    FieldConfigPropsByValue<Values, boolean, 'input'>,
    'type' | 'value' | 'parse' | 'format' | 'as'
  >
) => {
  const { value: stateValue } = useFieldMeta<Values, boolean>(props.name);
  const { name, ...fieldProps } = props;

  return (
    <Field
      name={props.name}
      as="input"
      type="checkbox"
      checked={stateValue}
      parse={parseCheckboxBooleanFromEvent}
      format={formatUndefinedFn}
      {...fieldProps}
    />
  );
};
