import React from 'react';
import { useTypedFieldBag } from '../src';
import { FieldAsComponent } from '../src/types/field-as-component-types';
import {
  FormValues,
  NumberValuedAsFC,
  NumberValuedClassComponent,
} from './test-helpers';

const typedBag = useTypedFieldBag<FormValues>();

typedBag.useField<'strVal'>({
  name: 'strVal',
});
typedBag.useField<'strVal'>({
  name: 'strVal',
  as: 'input',
});
typedBag.useField<'numVal', typeof NumberValuedAsFC>({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
typedBag.useField<
  'numVal',
  FieldAsComponent<number, number, { otherProp: string }>
>({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
typedBag.useField<'strVal', typeof NumberValuedAsFC>({
  name: 'strVal',
  as: NumberValuedAsFC,
  otherProp: '',
  parse: value => value.toString(),
  format: value => parseInt(value, 10),
});
typedBag.useField({
  name: 'strVal',
  as: 'input',
});
typedBag.useField({
  name: 'numVal',
  as: 'input',
  parse: (value: string) => parseInt(value, 10),
  format: (value: number) => value.toString(),
});
typedBag.useField({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});

/**
 * Expected errors
 */
typedBag.useField<'strVal'>({
  // @ts-expect-error numVal should be strVal
  name: 'numVal',
});
typedBag.useField<'strVal'>({
  name: 'strVal',
  // @ts-expect-error should be input
  as: NumberValuedAsFC,
});
typedBag.useField<'strVal', 'input'>({
  name: 'strVal',
  // @ts-expect-error should be input
  as: NumberValuedAsFC,
});
// @ts-expect-error missing otherProp
typedBag.useField({
  name: 'numVal',
  as: NumberValuedAsFC,
});
// @ts-expect-error missing otherProp
typedBag.useField({
  name: 'numVal',
  as: NumberValuedClassComponent,
});
// @ts-expect-error number must be parsed / formatted to string
typedBag.useField<'strVal', typeof NumberValuedAsFC>({
  name: 'strVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
// @ts-expect-error number must be parsed / formatted to string
typedBag.useField({
  name: 'strVal',
  as: NumberValuedClassComponent,
  otherProp: '',
});
