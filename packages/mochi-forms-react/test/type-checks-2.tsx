import * as React from 'react';
import {
  Field,
  FieldAsProps,
  FieldInputProps,
  useField,
  ValueMatchingPath,
} from '../src';

let _stringFieldConfigAsProp: FieldConfigPropsByName<
  FormValues,
  'strVal',
  FieldCompatibleComponentMatchingValue<FormValues, string>
> = {
  name: 'strVal',
  as: 'input',
};

let _numberMatchedFieldConfigAsProp: FieldConfigPropsByName<
  FormValues,
  'numVal',
  FieldCompatibleComponentMatchingValue<FormValues, number>
> = {
  name: 'numVal',
  as: NumberValuedField,
};

_numberMatchedFieldConfigAsProp = {
  // @ts-expect-error name should be count
  name: 'strVal',
  as: NumberValuedField,
};

_stringFieldConfigAsProp = {
  name: 'strVal',
  // @ts-expect-error NumberValuedField doesn't match value of name 'strVal'
  as: NumberValuedField,
};

const _numberMismatchedFieldConfigAsProp: FieldConfigPropsByName<
  FormValues,
  'strVal',
  FieldCompatibleComponentMatchingValue<FormValues, number>
> = {
  name: 'strVal',
  as: 'input',
};
// @ts-expect-error number field does not match input
_numberMismatchedFieldConfigAsProp.as = NumberValuedField;

let fieldConfigProps: FieldConfigProps<string, string, string> | undefined;
fieldConfigProps = {
  validate: (_value: string) => {},
  parse: (value: string) => value,
  format: (value: string) => value,
  value: '',
};
fieldConfigProps = {
  // @ts-expect-error name should match FieldValidator<string>
  validate: (value: number) => {},
  // @ts-expect-error name should match ParseFn<string, string>
  parse: (value: number) => value,
  // @ts-expect-error name should match FormatFn<string, string>
  format: (value: number) => value,
  // @ts-expect-error value should be a string
  value: 0,
};

/**
 * FieldAsProps tests
 */
let fieldAsProps: FieldAsProps<FormValues, string, string, string> | undefined;
fieldAsProps = {
  value: '',
  name: 'strVal',
  onChange: (_value: string) => {},
  onBlur: _event => {},
};
fieldAsProps = {
  // @ts-expect-error name should match a value with string
  name: 'numVal',
  // @ts-expect-error value should be string
  value: 0,
  // @ts-expect-error onChange value should be a string
  onChange: (value: number) => {},
  // @ts-expect-error this should be a blur event
  onBlur: (event: boolean) => {},
};

type InputProps = React.ComponentProps<'input'>;
type HelloNameProps = {
  name: 'strVal';
};

let fieldNameProps: InputProps & HelloNameProps extends FieldConfigNameProp<
  FormValues,
  infer Name
>
  ? FieldConfigNameProp<FormValues, Name>
  : never;

let fieldAsValueProps: Required<InputProps> extends FieldAsValueProps<
  infer FormattedValue,
  infer OnChangeValue
>
  ? {
      formattedValue: FormattedValue;
      onChangeValue: OnChangeValue;
    }
  : never;

let fieldAndValueProps: InputProps & HelloNameProps extends FieldConfigNameProp<
  FormValues,
  infer Name
>
  ? Required<InputProps> extends FieldAsValueProps<
      infer FormattedValue,
      infer OnChangeValue
    >
    ? FieldAsProps<
        FormValues,
        ValueMatchingPath<FormValues, Name>,
        FormattedValue,
        OnChangeValue
      >
    : never
  : never;

const _hello = () => {
  const field = useField<FormValues>({
    name: 'strVal',
  });
};

let FormValueTypedFieldComponent: FieldComponent<FormValues>;

export const UsingTypedFieldComponent = () => (
  <>
    <FormValueTypedFieldComponent name="strVal" />
    <FormValueTypedFieldComponent name="numVal" />
    <FormValueTypedFieldComponent name="strVal" as="input" />
    <FormValueTypedFieldComponent name="numVal" as="input" />
    <FormValueTypedFieldComponent
      name="strVal"
      // @ts-expect-error NumberValuedField doesn't match string value from path `hello`
      as={NumberValuedField}
    />
    <FormValueTypedFieldComponent
      name="strVal"
      validate={(_value: string) => {}}
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => ''}
      format={_value => ''}
      value=""
    />
    <FormValueTypedFieldComponent
      name="numVal"
      as={NumberValuedField}
      validate={(_value: number) => {}}
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => 0}
      format={_value => 0}
      value={0}
    />
    <FormValueTypedFieldComponent
      name="strVal"
      // @ts-expect-error NumberValuedField doesn't match string value from path `hello`
      as={NumberValuedField}
      // @ts-expect-error value should be string
      validate={(_value: number) => {}}
      // @ts-expect-error event should be HTMLInputElement
      parse={(event: React.ChangeEvent<HTMLAnchorElement>) => ''}
      format={_value => 0}
      value={0}
    />
    <FormValueTypedFieldComponent
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
    <FormValueTypedFieldComponent
      name="numVal"
      as={NumberValuedField}
      // @ts-expect-error value doesn't match number
      validate={(_value: string) => {}}
      // @ts-expect-error event doesn't match onChange fn
      parse={(_event: React.ChangeEvent<HTMLAnchorElement>) => 0}
      // @ts-expect-error returned value doesn't match number
      // eslint-disable-next-line react/jsx-no-duplicate-props
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => ''}
      // @ts-expect-error string doesn't match FormattedValue of number
      format={_value => ''}
      // @ts-expect-error string doesn't match FormattedValue of number
      value={''}
    />
  </>
);

const hello = () => {
  return (
    <>
      <Field<FormValues, string, 'input'> name="strVal" as="input"></Field>
      <Field<FormValues, string, 'input'>
        name="strVal"
        // @ts-expect-error a doesn't match input
        as="a"
      />
      <Field<FormValues, string, 'input'>
        // @ts-expect-error name doesn't exist
        name="number"
        as="input"
      />
      <Field<FormValues, string, 'input'>
        // @ts-expect-error Count doesn't match string
        name="numVal"
        as="input"
      >
        <p>hello</p>
      </Field>
      <Field<FormValues>
        name="numVal"
        format={value => {}}
        parse={value => value}
        as="input"
      >
        <p>hello</p>
      </Field>
      <Field<
        FormValues,
        number | '',
        React.FunctionComponent<FieldInputProps<FormValues, number | ''>>
      >
        name="numVal"
        format={value => {}}
        parse={value => 0 || ''}
        as={NumberField}
      >
        <p>hello</p>
      </Field>
    </>
  );
};
