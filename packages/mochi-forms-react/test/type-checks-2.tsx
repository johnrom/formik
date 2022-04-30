import * as React from 'react';
import {
  Field,
  FieldAsComponent,
  FieldAsComponentProps,
  FieldAsProps,
  FieldCompatibleComponent,
  FieldInputProps,
} from '../src';

interface FormValues {
  hello: string;
  count: number;
}

/**
 * FieldCompatibleComponent tests
 */
let fieldCompatibleComponent: FieldCompatibleComponent;

fieldCompatibleComponent = 'input';
fieldCompatibleComponent = 'a';
fieldCompatibleComponent = (
  props: FieldAsProps<FormValues, string, string, string>
) => null;
fieldCompatibleComponent = (props: FieldAsComponentProps<any, any, 'input'>) =>
  null;
fieldCompatibleComponent = (props: { value: boolean }) => null;
// @ts-expect-error onChange must be a callback
fieldCompatibleComponent = (props: { value: boolean; onChange: boolean }) =>
  null;

/**
 * FieldAsComponent tests
 */
let fieldAsComponent:
  | FieldAsComponent<FormValues, string, string, string>
  | undefined;
fieldAsComponent = (props: FieldAsProps<FormValues, string, string, string>) =>
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
  // @ts-expect-error value should be string
  value: 0,
  // @ts-expect-error name should match a value with string
  name: 'count',
  // @ts-expect-error onChange value should be a string
  onChange: (value: number) => {},
  // @ts-expect-error this should be a blur event
  onBlur: (event: boolean) => {},
};

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

const NumberField = <Values,>(
  props: FieldAsComponentProps<Values, number | '', 'input'>
) => {
  const hello = props.value;
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
