import * as React from 'react';
import { getTypedHelpers } from '../src';
import { FormValues, NumberValuedAsFC } from './test-helpers';

/**
 * Check that useTypedField works
 */
const UseFieldAsInput = () => {
  const typedHelpers = getTypedHelpers<FormValues>();

  const [inputField] = typedHelpers.useTypedField({
    name: 'numVal',
    parse: event => parseInt(event.target.value, 10),
  });

  const [numberField] = typedHelpers.useTypedField({
    name: 'strVal',
    as: NumberValuedAsFC,
    parse: value => value.toLocaleString(),
    format: value => parseInt(value, 10),
    otherProp: '',
  });

  return (
    <>
      <input {...inputField} />
      <NumberValuedAsFC {...numberField} />
      {/* @ts-expect-error NumberValuedAsFC props aren't assignable to input props */}
      <input {...numberField} />
      {/* @ts-expect-error input props aren't assignable to NumberValuedAsFC props */}
      <NumberValuedAsFC {...inputField} />
    </>
  );
};
