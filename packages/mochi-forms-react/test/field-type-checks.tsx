import React from 'react';
import { createTypedHelpers } from '../src';
import { FieldAsComponent } from '../src/types/field-as-component-types';
import {
  FormValues,
  NumberValuedAsFC,
  NumberValuedClassComponent,
} from './test-helpers';

const typedBag = createTypedHelpers<FormValues>();

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
  parse: (event: React.ChangeEvent<HTMLInputElement>) =>
    parseInt(event.target.value, 10),
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
// @ts-expect-error string | number must be formatted to number
typedBag.useField({
  name: 'strOrNumVal',
  as: NumberValuedClassComponent,
  otherProp: '',
});

export const UsingTypedFieldComponent = () => (
  <>
    <typedBag.Field<'strVal'> name="strVal" />
    <typedBag.Field<'strVal'> name="strVal" as="input" />
    <typedBag.Field<'numVal', typeof NumberValuedAsFC>
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.Field<
      'numVal',
      FieldAsComponent<number, number, { otherProp: string }>
    >
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.Field<
      'numVal',
      FieldAsComponent<number, number, { otherProp: string }>
    >
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.Field<'strVal', typeof NumberValuedAsFC>
      name="strVal"
      as={NumberValuedAsFC}
      parse={value => value.toString()}
      format={value => parseInt(value, 10)}
      otherProp=""
    />
    <typedBag.Field name="strVal" />
    <typedBag.Field name="strVal" as="input" />
    <typedBag.Field name="numVal" as={NumberValuedAsFC} otherProp="" />
    <typedBag.Field
      name="numVal"
      as="input"
      parse={(event: React.ChangeEvent<HTMLInputElement>) =>
        parseInt(event.target.value, 10)
      }
      format={(value: number) => value.toString()}
    />
    <typedBag.Field name="numVal" as={NumberValuedAsFC} otherProp="" />
    {/**
     * Expected Errors
     */}
    <typedBag.Field<'strVal'>
      // @ts-expect-error should match strVal
      name="numVal"
    />
    <typedBag.Field<'strVal'>
      name="strVal"
      // @ts-expect-error should be input
      as={NumberValuedAsFC}
    />
    <typedBag.Field<'strVal', 'input'>
      name="strVal"
      // @ts-expect-error should be input
      as={NumberValuedAsFC}
    />
    {/* @ts-expect-error missing otherProp */}
    <typedBag.Field name="numVal" as={NumberValuedAsFC} />
    {/* @ts-expect-error missing otherProp */}
    <typedBag.Field name="numVal" as={NumberValuedClassComponent} />
    {/* @ts-expect-error number must be parsed / formatted to string */}
    <typedBag.Field name="strVal" as={NumberValuedAsFC} otherProp="" />
    {/* @ts-expect-error number must be parsed / formatted to string */}
    <typedBag.Field
      name="strVal"
      as={NumberValuedClassComponent}
      otherProp=""
    />
    <typedBag.Field
      name="strVal"
      // @ts-expect-error value should be string
      validate={(_value: number) => {}}
      // @ts-expect-error event should be HTMLAnchorElement
      parse={(event: React.ChangeEvent<HTMLAnchorElement>) => ''}
      // @ts-expect-error format should be compatible with HTMLInputElement.value
      format={value => ({})}
      // @ts-expect-error value format should be compatible with HTMLInputElement.value
      value={{}}
    />
    <typedBag.Field
      name="strVal"
      as={NumberValuedAsFC}
      // @ts-expect-error value should be string
      validate={(_value: number) => {}}
      // @ts-expect-error ChangeHandlerValue should be number
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => 0}
      // @ts-expect-error FormValue should be string
      format={(_value: number) => 0}
      // @ts-expect-error FormattedValue should be number
      value={''}
    />
    <typedBag.Field
      name="strVal"
      as={NumberValuedAsFC}
      // @ts-expect-error validate should return a string | void
      validate={_value => 0}
      // @ts-expect-error should parse to string
      parse={value => value}
      // @ts-expect-error should format to number
      format={_value => ''}
      value={0}
    />
    <typedBag.Field name="strOrNumVal" validate={(value: string | number) => { }} />
    <typedBag.Field name="strOrNumVal" as={NumberValuedAsFC} format={value => typeof value === "string" ? parseInt(value, 10) : value} otherProp="" />
  </>
);
