import * as React from 'react';
import {
  Field,
  FieldAsComponent,
  FieldAsComponentProps,
  FieldAsProps,
  FieldAsValueProps,
  FieldCompatibleAsProps,
  FieldCompatibleComponent,
  FieldCompatibleComponentMatchingValue,
  FieldConfigAsProp,
  FieldConfigNameProp,
  FieldConfigProps,
  FieldConfigPropsByName,
  FieldConfigValueProps,
  FieldInputProps,
  PathOf,
  ValueMatchingPath,
} from '../src';

interface FormValues {
  strVal: string;
  numVal: number;
  strOrNumVal: string | number;
}

const NumberValuedField = (
  _props: FieldAsProps<
    FormValues,
    number,
    number,
    React.ChangeEvent<HTMLInputElement>
  >
) => null;

/**
 * FieldConfigNameProp tests
 */
let misconfiguredFieldConfigNameProp: FieldConfigNameProp<
  FormValues,
  // @ts-expect-error path doesn't exist in FormValues
  'nonexistent'
>;
const fieldConfigNameProp: FieldConfigNameProp<FormValues, 'strVal'> = {
  name: 'strVal',
};
// @ts-expect-error numVal doesn't match strVal
fieldConfigNameProp.name = 'numVal';
// @ts-expect-error strOrNumVal doesn't match strVal
fieldConfigNameProp.name = 'strOrNumVal';
// @ts-expect-error nonexistent doesn't exist in path
fieldConfigNameProp.name = 'nonexistent';

/**
 * FieldCompatibleAsProps tests
 *
 * multiple value types should match any value type
 */
const fieldCompatibleAsProps_strOrNumVal: FieldCompatibleAsProps<
  FormValues,
  string | number
> = {
  name: 'strOrNumVal',
};
// a FormValue which accepts string | number is compatible with a FieldMatchingValue<string> and a FieldMatchingValue<number>
fieldCompatibleAsProps_strOrNumVal.name = 'strVal';
fieldCompatibleAsProps_strOrNumVal.name = 'numVal';

/**
 * string-only FormValues are more restrictive
 */
const fieldCompatibleAsProps_strVal: FieldCompatibleAsProps<
  FormValues,
  string
> = {
  name: 'strVal',
};
// @ts-expect-error a FormValue which only accepts strings is not compatible with a FieldMatchingValue<string | number>
fieldCompatibleAsProps_strVal.name = 'strOrNumVal';
// @ts-expect-error numVal is not assignable to strVal
fieldCompatibleAsProps_strVal.name = 'numVal';
// @ts-expect-error nonexistent doesn't exist
fieldCompatibleAsProps_strVal.name = 'nonexistent';

/**
 * FieldCompatibleComponent tests
 */
let fieldCompatibleComponent: FieldCompatibleComponent;
fieldCompatibleComponent = 'input';
fieldCompatibleComponent = 'a';
fieldCompatibleComponent = (
  _props: FieldAsProps<FormValues, string, string, string>
) => null;
fieldCompatibleComponent = (_props: FieldAsComponentProps<any, 'input'>) =>
  null;
fieldCompatibleComponent = (_props: { value: boolean }) => null;
// @ts-expect-error onChange must be a callback
fieldCompatibleComponent = (props: { value: boolean; onChange: boolean }) =>
  null;

/**
 * FieldAsComponent tests
 */
let fieldAsComponent:
  | FieldAsComponent<FormValues, string, string, string>
  | undefined;
fieldAsComponent = (_props: FieldAsProps<FormValues, string, string, string>) =>
  null;
// component doesn't need to match signature, just be compatible
fieldAsComponent = () => null;
// @ts-expect-error value should be string
fieldAsComponent = (props: { value: number }) => null;
// @ts-expect-error name prop should match FormValues string path
fieldAsComponent = (props: { name: 'numVal' }) => null;
// @ts-expect-error onChange should accept a string
fieldAsComponent = (props: {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => null;
// @ts-expect-error onBlur accept a focus event
fieldAsComponent = (props: {
  onBlur: React.ChangeEventHandler<HTMLInputElement>;
}) => null;

let fieldCompatibleComponentMatchingValue: FieldCompatibleComponentMatchingValue<
  FormValues,
  string
> = 'input';
// @ts-expect-error FieldAsProps doesn't match value string
fieldCompatibleComponentMatchingValue = (
  _props: FieldAsProps<FormValues, number, any, any>
) => null;

let fieldConfigAsProp: FieldConfigAsProp<'input'> = {};
fieldConfigAsProp = {
  as: 'input',
};
fieldConfigAsProp = {
  // @ts-expect-error as should match input
  as: 'a',
};

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

export type FieldComponent<Values> = {
  <
    Name extends PathOf<Values>,
    AsField extends FieldCompatibleComponent = 'input'
  >(
    props: FieldConfigPropsByName<Values, Name, AsField>
  ): JSX.Element;

  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
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

let fieldAsComponentProps: FieldAsComponentProps<FormValues, 'input'> = {
  name: 'strVal',
};

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
