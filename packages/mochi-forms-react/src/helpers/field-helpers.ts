import { FormApi, GetStateFn, InputElements } from '../types';
import { getIn, getValueFromEvent, isInputEvent } from '../utils';
import { PathLikeValue, PathOf } from './path-helpers';

export const noopParseFn = (value: unknown) => value;

export const numberParseFn = (value: any) => {
  const parsed = parseFloat(value);

  return isNaN(parsed) ? '' : parsed;
};

export const defaultEventParser = <Values>(
  event: React.ChangeEvent<React.ElementRef<InputElements>>,
  name: PathOf<Values>,
  getState: GetStateFn<Values>
) => {
  const type = event.target.type;
  let value = getValueFromEvent(event);

  if (event.target instanceof HTMLInputElement) {
    if (/number|range/.test(type)) {
      value = numberParseFn(value);
    } else if (
      /checkbox/.test(type) &&
      event.target instanceof HTMLInputElement
    ) {
      value = getValueForCheckbox(
        getIn(getState().values, name),
        event.target.checked,
        value
      );
    }
  } else if (
    event.target instanceof HTMLSelectElement &&
    event.target.multiple
  ) {
    value = getSelectedValues(event.target.options);
  }

  return value;
};

export const selectFieldOnChange = <Value, Values>(
  {
    setFieldValue,
    getState,
  }: Pick<FormApi<Values>, 'setFieldValue' | 'getState'>,
  name: PathLikeValue<Value, Values>
) => {
  return (
    eventOrValue: React.ChangeEvent<React.ElementRef<InputElements>> | Value
  ) => {
    setFieldValue(
      name,
      isInputEvent(eventOrValue)
        ? defaultEventParser(eventOrValue, name, getState)
        : eventOrValue
    );
  };
};

/** Return multi select values based on an array of options */
export function getSelectedValues(options: HTMLOptionsCollection) {
  const result = [];
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index];
      if (option.selected) {
        result.push(option.value);
      }
    }
  }
  return result;
}

/** Return the next value for a checkbox */
export function getValueForCheckbox(
  currentValue: string | any[],
  checked: boolean,
  valueProp: any
) {
  // If the current value was a boolean, return a boolean
  if (typeof currentValue === 'boolean') {
    return Boolean(checked);
  }

  // If the currentValue was not a boolean we want to return an array
  let currentArrayOfValues = [];
  let isValueInArray = false;
  let index = -1;

  if (!Array.isArray(currentValue)) {
    // eslint-disable-next-line eqeqeq
    if (!valueProp || valueProp == 'true' || valueProp == 'false') {
      return Boolean(checked);
    }
  } else {
    // If the current value is already an array, use it
    currentArrayOfValues = currentValue;
    index = currentValue.indexOf(valueProp);
    isValueInArray = index >= 0;
  }

  // If the checkbox was checked and the value is not already present in the aray we want to add the new value to the array of values
  if (checked && valueProp && !isValueInArray) {
    return currentArrayOfValues.concat(valueProp);
  }

  // If the checkbox was unchecked and the value is not in the array, simply return the already existing array of values
  if (!isValueInArray) {
    return currentArrayOfValues;
  }

  // If the checkbox was unchecked and the value is in the array, remove the value and return the array
  return currentArrayOfValues
    .slice(0, index)
    .concat(currentArrayOfValues.slice(index + 1));
}
