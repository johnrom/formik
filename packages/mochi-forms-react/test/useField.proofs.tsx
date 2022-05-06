import * as React from 'react';
import { useTypedHelpers } from "../src";
import { FormValues, NumberValuedAsFC } from "./test-helpers";

/**
 * Check that useField works
 */
const UseFieldAsInput = () => {
  const typedHelpers = useTypedHelpers<FormValues>();

  const [inputField] = typedHelpers.useField({
    name: 'numVal',
    parse: event => parseInt(event.target.value, 10)
  });

  const [numberField] = typedHelpers.useField({
    name: 'strVal',
    as: NumberValuedAsFC,
    parse: value => value.toLocaleString(),
    format: value => parseInt(value, 10),
    otherProp: '',
  });

  return <>
    <input {...inputField} />
    <NumberValuedAsFC {...numberField} />
    { /* @ts-expect-error NumberValuedAsFC props aren't assignable to input props */ }
    <input {...numberField} />
    { /* @ts-expect-error input props aren't assignable to NumberValuedAsFC props */ }
    <NumberValuedAsFC {...inputField} />
  </>
}
