import React from 'react';
import {
  FieldAsCompatibleComponent,
  AnyFieldAsComponentMatchingValues,
  FieldAsComponentChangeHandlerValue,
  FieldAsComponentCompatibleProps,
  FieldAsComponentFormattedValue,
  FieldAsComponentRequiredProps,
  FieldAsComponentValueProps,
  FieldAsComponentValuePropsByComponent,
} from '../src/types/field-as-component-types';
import { NumberValuedAsFunctionComponentByProps } from './test-helpers';

const fieldAsComponentProps: FieldAsComponentRequiredProps<
  string,
  React.ChangeEvent<HTMLInputElement>
> = {
  value: '',
  onChange: (_value: React.ChangeEvent<HTMLInputElement>) => {},
  onBlur: () => {},
};
// @ts-expect-error number is not assignable to string
fieldAsComponentProps.value = 0;
// @ts-expect-error number is not assignable to change event
fieldAsComponentProps.onChange = (value: number) => {};
// @ts-expect-error number onBlur
fieldAsComponentProps.onBlur = undefined;

const fieldAsComponentCompatibleProps: FieldAsComponentCompatibleProps = {
  value: '' || 0 || {} || [],
  onChange: (_value: string | number | object | string[]) => {},
  onBlur: () => {},
};
// @ts-expect-error onChange must be a callback
fieldAsComponentCompatibleProps.onChange = 0;
// @ts-expect-error onBlur must be a callback
fieldAsComponentCompatibleProps.onBlur = 0;

/**
 * FieldCompatibleComponent tests
 */
let _fieldAsCompatibleComponent: FieldAsCompatibleComponent;
_fieldAsCompatibleComponent = 'input';
_fieldAsCompatibleComponent = 'a';
_fieldAsCompatibleComponent = NumberValuedAsFunctionComponentByProps;
_fieldAsCompatibleComponent = (
  _props: FieldAsComponentRequiredProps<string, string>
) => null;
_fieldAsCompatibleComponent = (_props: {
  value: boolean;
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => void;
}) => null;
_fieldAsCompatibleComponent = () => null;

const fieldAsComponentValueProps: FieldAsComponentValueProps<
  string,
  React.ChangeEvent<HTMLInputElement>
> = {
  value: '',
  onChange: (_event: React.ChangeEvent<HTMLInputElement>) => {},
};
// @ts-expect-error value must be string
fieldAsComponentValueProps.value = 0;
// @ts-expect-error onChange doesn't match expected ChangeEvent value
fieldAsComponentValueProps.onChange = (
  _event: React.ChangeEvent<HTMLAnchorElement>
) => {};

let _fieldAsComponentFormattedValue: FieldAsComponentFormattedValue<'input'> =
  '';
_fieldAsComponentFormattedValue = 0;

let _fieldAsComponentChangeHandlerValue: FieldAsComponentChangeHandlerValue<'input'> =
  {} as React.ChangeEvent<HTMLInputElement>;
// @ts-expect-error change handlers are not compatible
_fieldAsComponentChangeHandlerValue = (
  _event: React.ChangeEvent<HTMLAnchorElement>
) => {};

const _fieldAsComponentValuePropsByComponent: FieldAsComponentValuePropsByComponent<'input'> =
  {
    onChange: (_event: React.ChangeEvent<HTMLInputElement>) => {},
    onBlur: () => {},
    value: '',
    placeholder: 'hello',
  };
// @ts-expect-error onChange should match input change event
_fieldAsComponentValuePropsByComponent.onChange = (
  _event: React.ChangeEvent<HTMLAnchorElement>
) => {};
// @ts-expect-error onChange should be a callback
_fieldAsComponentValuePropsByComponent.onChange = '';
// @ts-expect-error onBlur should match input focus event
_fieldAsComponentValuePropsByComponent.onBlur = (
  _event: React.ChangeEvent<HTMLAnchorElement>
) => {};
// @ts-expect-error onBlur should be a callback
_fieldAsComponentValuePropsByComponent.onBlur = '';
// @ts-expect-error <input value={} /> does not accept an object
_fieldAsComponentValuePropsByComponent.value = {};
// @ts-expect-error <input palceholder={} /> does not accept an object
_fieldAsComponentValuePropsByComponent.placeholder = {};

const _fieldAsComponentValuepropsByComponent_custom: FieldAsComponentValuePropsByComponent<
  typeof NumberValuedAsFunctionComponentByProps
> = {
  onChange: (_event: number) => {},
  onBlur: () => {},
  value: 0,
  otherProp: 'hello',
};
// @ts-expect-error onChange should match number
_fieldAsComponentValuepropsByComponent_custom.onChange = (
  _event: React.ChangeEvent<HTMLInputElement>
) => {};
// @ts-expect-error onChange should match number
_fieldAsComponentValuepropsByComponent_custom.onChange = '';
// @ts-expect-error onChange should match number
_fieldAsComponentValuepropsByComponent_custom.onChange = (
  _event: React.ChangeEvent<HTMLAnchorElement>
) => {};
// @ts-expect-error onChange should match input change event
_fieldAsComponentValuepropsByComponent_custom.onBlur = '';
// @ts-expect-error onChange should match input change event
_fieldAsComponentValuepropsByComponent_custom.onBlur = (event: boolean) => {};
// @ts-expect-error otherProp is required
_fieldAsComponentValuepropsByComponent_custom.otherProp = undefined;

/**
 * FieldAsComponent tests
 */
let _fieldAsComponent: AnyFieldAsComponentMatchingValues<
  string,
  React.ChangeEvent<HTMLInputElement>
>;
_fieldAsComponent = (
  _props: FieldAsComponentRequiredProps<
    string,
    React.ChangeEvent<HTMLInputElement>
  >
) => null;
// component doesn't need to match signature, just be compatible
_fieldAsComponent = () => null;
// @ts-expect-error value should be string
_fieldAsComponent = (_props: { value: number }) => null;
// @ts-expect-error onChange should accept an input change event
_fieldAsComponent = (_props: {
  onChange: React.ChangeEventHandler<HTMLAnchorElement>;
}) => null;
// @ts-expect-error onChange should accept an input change event
_fieldAsComponent = (_props: { onChange: number }) => null;
// @ts-expect-error onBlur accept a focus event
_fieldAsComponent = (_props: {
  onBlur: React.ChangeEventHandler<HTMLInputElement>;
}) => null;
// @ts-expect-error onBlur accept a focus event
_fieldAsComponent = (_props: { onBlur: number }) => null;
