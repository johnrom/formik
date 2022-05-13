import React from 'react';
import { getTypedHelpers } from '../src';
import { FieldAsComponent } from '../src/types/field-as-component-types';
import {
  FormValues,
  NumberValuedAsFC,
  NumberValuedClassComponent,
} from './test-helpers';

const typedBag = getTypedHelpers<FormValues>();

typedBag.useTypedField<'strVal'>({
  name: 'strVal',
});
typedBag.useTypedField<'strVal'>({
  name: 'strVal',
  as: 'input',
});
typedBag.useTypedField<'numVal', typeof NumberValuedAsFC>({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
typedBag.useTypedField<
  'numVal',
  FieldAsComponent<number, number, { otherProp: string }>
>({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
typedBag.useTypedField<'strVal', typeof NumberValuedAsFC>({
  name: 'strVal',
  as: NumberValuedAsFC,
  otherProp: '',
  parse: value => value.toString(),
  format: value => parseInt(value, 10),
});
typedBag.useTypedField({
  name: 'strVal',
  as: 'input',
});
typedBag.useTypedField({
  name: 'numVal',
  as: 'input',
  parse: (event: React.ChangeEvent<HTMLInputElement>) =>
    parseInt(event.target.value, 10),
  format: (value: number) => value.toString(),
});
typedBag.useTypedField({
  name: 'numVal',
  as: NumberValuedAsFC,
  otherProp: '',
});

/**
 * Expected errors
 */
typedBag.useTypedField<'strVal'>({
  // @ts-expect-error numVal should be strVal
  name: 'numVal',
});
typedBag.useTypedField<'strVal'>({
  name: 'strVal',
  // @ts-expect-error should be input
  as: NumberValuedAsFC,
});
typedBag.useTypedField<'strVal', 'input'>({
  name: 'strVal',
  // @ts-expect-error should be input
  as: NumberValuedAsFC,
});
// @ts-expect-error missing otherProp
typedBag.useTypedField({
  name: 'numVal',
  as: NumberValuedAsFC,
});
// @ts-expect-error missing otherProp
typedBag.useTypedField({
  name: 'numVal',
  as: NumberValuedClassComponent,
});
// @ts-expect-error number must be parsed / formatted to string
typedBag.useTypedField<'strVal', typeof NumberValuedAsFC>({
  name: 'strVal',
  as: NumberValuedAsFC,
  otherProp: '',
});
// @ts-expect-error number must be parsed / formatted to string
typedBag.useTypedField({
  name: 'strVal',
  as: NumberValuedClassComponent,
  otherProp: '',
});
// @ts-expect-error string | number must be formatted to number
typedBag.useTypedField({
  name: 'strOrNumVal',
  as: NumberValuedClassComponent,
  otherProp: '',
});

export const UsingTypedFieldComponent = () => (
  <>
    <typedBag.TypedField<'strVal'> name="strVal" />
    <typedBag.TypedField<'strVal'> name="strVal" as="input" />
    <typedBag.TypedField<'numVal', typeof NumberValuedAsFC>
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.TypedField<
      'numVal',
      FieldAsComponent<number, number, { otherProp: string }>
    >
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.TypedField<
      'numVal',
      FieldAsComponent<number, number, { otherProp: string }>
    >
      name="numVal"
      as={NumberValuedAsFC}
      otherProp=""
    />
    <typedBag.TypedField<'strVal', typeof NumberValuedAsFC>
      name="strVal"
      as={NumberValuedAsFC}
      parse={value => value.toString()}
      format={value => parseInt(value, 10)}
      otherProp=""
    />
    <typedBag.TypedField name="strVal" />
    <typedBag.TypedField name="strVal" as="input" />
    <typedBag.TypedField name="numVal" as={NumberValuedAsFC} otherProp="" />
    <typedBag.TypedField
      name="numVal"
      as="input"
      parse={(event: React.ChangeEvent<HTMLInputElement>) =>
        parseInt(event.target.value, 10)
      }
      format={(value: number) => value.toString()}
    />
    <typedBag.TypedField name="numVal" as={NumberValuedAsFC} otherProp="" />
    {/**
     * Expected Errors
     */}
    <typedBag.TypedField<'strVal'>
      // @ts-expect-error should match strVal
      name="numVal"
    />
    <typedBag.TypedField<'strVal'>
      name="strVal"
      // @ts-expect-error should be input
      as={NumberValuedAsFC}
    />
    <typedBag.TypedField<'strVal', 'input'>
      name="strVal"
      // @ts-expect-error should be input
      as={NumberValuedAsFC}
    />
    {/* @ts-expect-error missing otherProp */}
    <typedBag.TypedField name="numVal" as={NumberValuedAsFC} />
    {/* @ts-expect-error missing otherProp */}
    <typedBag.TypedField name="numVal" as={NumberValuedClassComponent} />
    {/* @ts-expect-error number must be parsed / formatted to string */}
    <typedBag.TypedField name="strVal" as={NumberValuedAsFC} otherProp="" />
    {/* @ts-expect-error number must be parsed / formatted to string */}
    <typedBag.TypedField
      name="strVal"
      as={NumberValuedClassComponent}
      otherProp=""
    />
    <typedBag.TypedField
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
    <typedBag.TypedField
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
    <typedBag.TypedField
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
    <typedBag.TypedField
      name="strOrNumVal"
      validate={(value: string | number) => {}}
    />
    <typedBag.TypedField
      name="strOrNumVal"
      as={NumberValuedAsFC}
      format={(value: string | number) =>
        typeof value === 'string' ? parseInt(value, 10) : value
      }
      otherProp=""
    />
    {/**
     *
     * todo: `format`'s `value` parameter should be inferred automatically, but it is `any` for some reason
    <typedBag.TypedField
      name="strOrNumVal"
      as={NumberValuedAsFC}
      format={value =>
        typeof value === 'string' ? parseInt(value, 10) : value
      }
      otherProp=""
    />
    */}
  </>
);
