import React from 'react';
import { FormikValues, ParseFn } from '../types';

export const noopParseFn = (value: unknown) => value;

export const parseNumberOrStringFromInputEvent = (event: {
  target: HTMLInputElement;
}) => {
  const parsed = parseFloat(event.target.value);

  return isNaN(parsed) ? event.target.value : parsed;
};

export const parseCheckboxArrayFromEvent =
  <Values extends FormikValues, SingleValue>(
    fieldValue: SingleValue
  ): ParseFn<Values, SingleValue[], React.ChangeEvent<HTMLInputElement>> =>
  (event, name, { getFieldMeta }) => {
    const values: SingleValue[] = getFieldMeta(name).value;
    const existingValueIndex = values.indexOf(fieldValue);
    const isValueInValues = existingValueIndex !== -1;

    return event.target.checked
      ? isValueInValues
        ? values
        : [...values, fieldValue]
      : isValueInValues
      ? values
          .slice(0, existingValueIndex)
          .concat(values.slice(existingValueIndex + 1))
      : values;
  };

export const parseRadioValueFromEvent =
  <Values extends FormikValues, Value>(
    fieldValue: Value
  ): ParseFn<Values, Value, React.ChangeEvent<HTMLInputElement>> =>
  (event, name, { getFieldMeta }) => {
    return event.target.checked ? fieldValue : getFieldMeta(name).value;
  };

export const parseCheckboxBooleanFromEvent = (
  event: React.ChangeEvent<HTMLInputElement>
) => event.target.checked;

export const formatUndefinedFn = () => undefined;
