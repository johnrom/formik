import * as React from 'react';
import {
  Field,
  FieldAsComponent,
  FieldAsComponentProps,
  FieldAsProps,
  FieldAsValueProps,
  FieldCompatibleComponent,
  FieldConfigAsProp,
  FieldConfigNameProp,
  FieldConfigPropsByName,
  FieldConfigValueProps,
  FieldInputProps,
  PathOf,
  ValueMatchingPath,
} from '../src';

interface FormValues {
  hello: string;
  count: number;
}

const NumberValuedField = <Values,>(
  _props: FieldAsProps<
    Values,
    number,
    number,
    React.ChangeEvent<HTMLInputElement>
  >
) => null;

let fieldConfigNameProp:
  | FieldConfigNameProp<FormValues, keyof FormValues>
  | undefined;
fieldConfigNameProp = {
  name: 'hello',
};
fieldConfigNameProp = {
  name: 'count',
};
fieldConfigNameProp = {
  // @ts-expect-error name should match PathOf<FormValues>
  name: 'bad',
};

let fieldConfigAsProp: FieldConfigAsProp<'input'> = {};
fieldConfigAsProp = {
  as: 'input',
};
fieldConfigAsProp = {
  // @ts-expect-error as should match input
  as: 'a',
};

let fieldConfigProps: FieldConfigValueProps<string, string, string> | undefined;
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
  name: 'hello',
  onChange: (_value: string) => {},
  onBlur: _event => {},
};
fieldAsProps = {
  // @ts-expect-error name should match a value with string
  name: 'count',
  // @ts-expect-error value should be string
  value: 0,
  // @ts-expect-error onChange value should be a string
  onChange: (value: number) => {},
  // @ts-expect-error this should be a blur event
  onBlur: (event: boolean) => {},
};

/**
 * FieldCompatibleComponent tests
 */
let fieldCompatibleComponent: FieldCompatibleComponent;

fieldCompatibleComponent = 'input';
fieldCompatibleComponent = 'a';
fieldCompatibleComponent = (
  _props: FieldAsProps<FormValues, string, string, string>
) => null;
fieldCompatibleComponent = (_props: FieldAsComponentProps<any, any, 'input'>) =>
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
fieldAsComponent = (props: { name: 'count' }) => null;
// @ts-expect-error onChange should accept a string
fieldAsComponent = (props: {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => null;
// @ts-expect-error onBlur accept a focus event
fieldAsComponent = (props: {
  onBlur: React.ChangeEventHandler<HTMLInputElement>;
}) => null;

type InputProps = React.ComponentProps<'input'>;
type HelloNameProps = {
  name: 'hello';
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
    <FormValueTypedFieldComponent
      name="hello"
      validate={(_value: string) => {}}
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => ''}
      format={_value => ''}
      value=""
    />
    <FormValueTypedFieldComponent
      name="count"
      as={NumberValuedField}
      validate={(_value: number) => {}}
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => 0}
      format={_value => 0}
      value={0}
    />
    <FormValueTypedFieldComponent
      name="hello"
      // @ts-expect-error Values should be resolved here and be required to be PathMatchingValue<number>
      as={NumberValuedField}
      validate={(_value: string) => {}}
      parse={(_event: React.ChangeEvent<HTMLInputElement>) => ''}
      format={_value => 0}
      value={0}
    />
    <FormValueTypedFieldComponent
      name="hello"
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
      name="count"
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
  name: 'hello',
};

const hello = () => {
  return (
    <>
      <Field<FormValues, string, 'input'> name="hello" as="input"></Field>
      <Field<FormValues, string, 'input'>
        name="hello"
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
        name="count"
        as="input"
      >
        <p>hello</p>
      </Field>
      <Field<FormValues>
        name="count"
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
        name="count"
        format={value => {}}
        parse={value => 0 || ''}
        as={NumberField}
      >
        <p>hello</p>
      </Field>
    </>
  );
};
