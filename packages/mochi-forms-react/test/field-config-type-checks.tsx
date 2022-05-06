import React from 'react';
import {
  ChangeEventHandlerResolvedValue,
  FieldConfigAsProp,
  FieldConfigFormatProp,
  FieldConfigNameProp,
  FieldConfigParseProp,
  FieldConfigProps,
  FieldConfigPropsByName,
  FieldConfigPropsByValue,
  FieldConfigValidateProp,
  FieldConfigValueProps,
  FieldConfigWithoutExtraProps,
} from '../src/types/field-config-types';
import {
  FormValues,
  NumberValuedAsFC,
  NumberValuedAsFunctionComponentByProps,
} from './test-helpers';

/**
 * FieldConfigNameProp tests
 */
let _misconfiguredFieldConfigNameProp: FieldConfigNameProp<
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

const _fieldConfigAsProp: FieldConfigAsProp<'input'> = {};
_fieldConfigAsProp.as = undefined;
_fieldConfigAsProp.as = 'input';
// @ts-expect-error a doesn't match input
_fieldConfigAsProp.as = 'a';

/**
 * FieldConfigAsProp tests
 */
const _fieldConfigAsProp_custom: FieldConfigAsProp<
  typeof NumberValuedAsFunctionComponentByProps
> = {};
_fieldConfigAsProp_custom.as = undefined;
_fieldConfigAsProp_custom.as = NumberValuedAsFunctionComponentByProps;
// @ts-expect-error a doesn't match input
_fieldConfigAsProp_custom.as = 'a';

/**
 * FieldConfigValidateProp tests
 */
const _fieldConfigValidateProp: FieldConfigValidateProp<string> = {};
_fieldConfigValidateProp.validate = undefined;
_fieldConfigValidateProp.validate = _value => '';
_fieldConfigValidateProp.validate = _value => {};
_fieldConfigValidateProp.validate = _value => Promise.resolve('');
_fieldConfigValidateProp.validate = _value => Promise.resolve();
// @ts-expect-error validate requires string | void
_fieldConfigValidateProp.validate = value => 0;
// @ts-expect-error validate requires Promise<string | void>
_fieldConfigValidateProp.validate = _value => Promise.resolve(0);

/**
 * ChangeEventHandlerResolvedValue tests
 */
let _changeEventHandlerResolvedValue: ChangeEventHandlerResolvedValue<
  React.ChangeEvent<HTMLInputElement>
> = '';
// @ts-expect-error we resolve input change events to event.target.value
_changeEventHandlerResolvedValue = {} as React.ChangeEvent<HTMLInputElement>;

let _changeEventHandlerResolvedValue_NotResolved: ChangeEventHandlerResolvedValue<
  React.ChangeEvent<HTMLAnchorElement>
> = {} as React.ChangeEvent<HTMLAnchorElement>;
// @ts-expect-error we leave ChangeEvents alone when we can't get `event.target.value`
// HTMLAnchorElement doesn't have a `value` prop.
_changeEventHandlerResolvedValue_NotResolved = '';
let _changeEventHandlerPrimitiveValue: ChangeEventHandlerResolvedValue<number> = 0;
// @ts-expect-error resolved value should match number
_changeEventHandlerPrimitiveValue = '';

/**
 * FieldConfigParseProp tests
 */
const _fieldConfigParseProp: FieldConfigParseProp<FormValues, string, React.ChangeEvent<HTMLInputElement>, string> = {};
_fieldConfigParseProp.parse = undefined;
_fieldConfigParseProp.parse = event => event.target.value;
// @ts-expect-error zero does not match
_fieldConfigParseProp.parse = value => 0;
// @ts-expect-error parse arg should not resolve to event.target.value, 
// even though parse isn't necessary when event.target.value is assignable to FormValue
_fieldConfigParseProp.parse = event => event;

// @ts-expect-error FormattedValue doesn't accept number
const _fieldConfigParseProp_whenRequired: FieldConfigParseProp<
  string,
  string | number
> = {};

/**
 * FieldConfigFormatProp tests
 */
const _fieldConfigFormatProp: FieldConfigFormatProp<string, string> = {};
_fieldConfigFormatProp.format = undefined;
_fieldConfigFormatProp.format = value => value;
// @ts-expect-error zero does not match
_fieldConfigFormatProp.format = value => 0;

/**
 * FieldConfigFormatProp tests
 */
// @ts-expect-error FormattedValue doesn't accept number
const _fieldConfigFormatProp_requiresFormat: FieldConfigFormatProp<
  string | number,
  string
> = {};
_fieldConfigFormatProp.format = undefined;
_fieldConfigFormatProp.format = value => value;
// @ts-expect-error zero does not match
_fieldConfigFormatProp.format = value => 0;

/**
 * FieldConfigValueProps tests
 */
const _fieldConfigValueProps: FieldConfigValueProps<FormValues, string, string, string> =
  {};
_fieldConfigValueProps.parse = value => value;
_fieldConfigValueProps.format = value => value;
// @ts-expect-error parse must return string
_fieldConfigValueProps.parse = _value => 0;
// @ts-expect-error format must return string
_fieldConfigValueProps.format = _value => 0;
_fieldConfigValueProps.validate = _value => '';
_fieldConfigValueProps.validate = _value => {};
_fieldConfigValueProps.validate = _value => Promise.resolve('');
_fieldConfigValueProps.validate = _value => Promise.resolve();
// @ts-expect-error validate requires string | void
_fieldConfigValueProps.validate = _value => 0;
// @ts-expect-error validate requires Promise<string | void>
_fieldConfigValueProps.validate = _value => Promise.resolve(0);

const _fieldConfigValueProps_inputOptionalParse: FieldConfigValueProps<
  FormValues,
  string,
  string,
  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
> = {};

// @ts-expect-error requires parse because FormattedValue is not assignable to FormValue
let _fieldConfigValueProps_requiringParse: FieldConfigValueProps<
  FormValues,
  string,
  string,
  number
> = {};
_fieldConfigValueProps_requiringParse = {
  // @ts-expect-error requires parse because FormattedValue is not assignable to FormValue
  parse: undefined,
};
_fieldConfigValueProps_requiringParse = {
  parse: value => value.toString(),
};
_fieldConfigValueProps_requiringParse = {
  // @ts-expect-error event.target is not assignable to string
  parse: event => event.target,
};

// @ts-expect-error requires format because FormValue is not assignable to FormattedValue
let _fieldConfigValueProps_requiringFormat: FieldConfigValueProps<
  FormValues,
  string | number,
  string,
  string | number
> = {};
_fieldConfigValueProps_requiringFormat = {
  // @ts-expect-error requires format because FormValue is not assignable to FormattedValue
  format: undefined,
};
_fieldConfigValueProps_requiringFormat = {
  format: value => value.toString(),
};

let _fieldConfigWithoutExtraProps: FieldConfigWithoutExtraProps<
  FormValues,
  string,
  'input'
> = {};
_fieldConfigWithoutExtraProps = {
  validate: (value: string) => '',
  format: value => value,
  parse: event => event.target.value,
  formatOnBlur: true,
};
_fieldConfigWithoutExtraProps = {
  // @ts-expect-error value should be string
  validate: (value: number) => '',
  // @ts-expect-error format should match formatted value of input
  format: value => {},
  // @ts-expect-error parse should return string
  parse: value => 0,
  // @ts-expect-error formatOnBlur should be boolean
  formatOnBlur: 0,
};
_fieldConfigWithoutExtraProps = {
  // @ts-expect-error value doesn't exist on FieldConfigWithoutExtraProps
  value: {},
};

// @ts-expect-error requires format
let _fieldConfigWithoutExtraProps_requiresFormat: FieldConfigWithoutExtraProps<
  FormValues,
  string | number,
  typeof NumberValuedAsFC
> = {};
_fieldConfigWithoutExtraProps_requiresFormat = {
  format: value => (typeof value === 'string' ? parseInt(value, 10) : value),
};

// @ts-expect-error requires parse
let _fieldConfigWithoutExtraProps_requiresParse: FieldConfigWithoutExtraProps<
  FormValues,
  number,
  'input'
> = {};
_fieldConfigWithoutExtraProps_requiresParse = {
  parse: event => parseInt(event.target.value, 10),
};

/**
 * FieldConfigProps tests
 */
let fieldConfigProps_input: FieldConfigProps<
  FormValues,
  string,
  'input'
> = {
  validate: (_value: string) => {},
  parse: (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
  format: (value: string) => value,
  value: '',
};
fieldConfigProps_input = {
  ...fieldConfigProps_input,
  // @ts-expect-error otherProp does not exist on input
  otherProp: 0,
};
fieldConfigProps_input = {
  // @ts-expect-error name should match FieldValidator<string>
  validate: (value: number) => {},
  // @ts-expect-error name should match ParseFn<string, string>
  parse: (value: number) => value,
  // @ts-expect-error name should match FormatFn<string, string>
  format: (value: number) => value,
  // @ts-expect-error value should match `input`
  value: {},
};

let fieldConfigProps_numberValuedAsFc: FieldConfigProps<
  FormValues,
  string,
  typeof NumberValuedAsFC
> = {
  validate: (_value: string) => {},
  parse: (value: number) => value.toString(),
  format: (value: string) => parseInt(value, 10),
  value: 0,
  otherProp: '',
};
fieldConfigProps_numberValuedAsFc = {
  // @ts-expect-error name should match FieldValidator<string>
  validate: (value: number) => {},
  // @ts-expect-error name should match ParseFn<string, string>
  parse: (value: number) => value,
  // @ts-expect-error name should match FormatFn<string, string>
  format: (value: number) => value,
  // @ts-expect-error value should be a number
  value: '',
  // @ts-expect-error otherProp is not a string
  otherProp: 0,
};

/**
 * FieldConfigPropsByValue tests
 */
let _fieldConfigPropsByValue: FieldConfigPropsByValue<
  FormValues,
  string,
  'input'
> = {
  name: 'strVal',
  onAnimationEnd: () => {},
};
_fieldConfigPropsByValue = {
  name: 'strVal',
  parse: event => event.target.value,
};
_fieldConfigPropsByValue = {
  name: 'strVal',
  // @ts-expect-error input.target.value resolves to string
  parse: (value: number) => 0,
};
_fieldConfigPropsByValue = {
  name: 'strVal',
  // @ts-expect-error should parse string
  parse: value => 0,
};
let _fieldConfigPropsByValue_inputNeedsParsing: FieldConfigPropsByValue<
  FormValues,
  number,
  'input'
> = {
  name: 'numVal',
  parse: event => parseInt(event.target.value, 10),
};

// @ts-expect-error the resolved value of input is a string. we need to parse that to a number.
_fieldConfigPropsByValue_inputNeedsParsing = {
  name: 'numVal',
};

let _fieldConfigPropsByValue_requiresFormatParse2: FieldConfigPropsByValue<
  FormValues,
  string,
  typeof NumberValuedAsFunctionComponentByProps
> = {
  name: 'strVal',
  format: value => parseInt(value, 10),
  parse: value => value.toString(),
  otherProp: '',
};
const { parse: _parse2, ...propsWithoutParse2 } =
  _fieldConfigPropsByValue_requiresFormatParse2;
const { format: _format2, ...propsWithoutFormat2 } =
  _fieldConfigPropsByValue_requiresFormatParse2;
const { otherProp: _otherProp2, ...propsWithoutOtherProp2 } =
  _fieldConfigPropsByValue_requiresFormatParse2;
// @ts-expect-error needs parse
_fieldConfigPropsByValue_requiresFormatParse2 = propsWithoutParse2;
// @ts-expect-error needs format
_fieldConfigPropsByValue_requiresFormatParse2 = propsWithoutFormat2;
// @ts-expect-error needs otherProp
_fieldConfigPropsByValue_requiresFormatParse2 = propsWithoutOtherProp2;

/**
 * FieldConfigPropsByName tests
 */
let _fieldConfigPropsByName: FieldConfigPropsByName<
  FormValues,
  'strVal',
  'input'
> = {
  name: 'strVal',
  onAnimationEnd: () => {},
};
_fieldConfigPropsByName = { name: 'strVal', parse: event => event.target.value };
_fieldConfigPropsByName = {
  name: 'strVal',
  // @ts-expect-error input.target.value resolves to string
  parse: (value: number) => 0,
};
_fieldConfigPropsByName = {
  name: 'strVal',
  // @ts-expect-error should parse string
  parse: value => 0,
};
let _fieldConfigPropsByName_inputNeedsParsing: FieldConfigPropsByName<
  FormValues,
  'numVal',
  'input'
> = {
  name: 'numVal',
  parse: event => parseInt(event.target.value, 10),
};

// @ts-expect-error the resolved value of input is a string. we need to parse that to a number.
_fieldConfigPropsByName_inputNeedsParsing = {
  name: 'numVal',
};

let _fieldConfigPropsByName_requiresFormatParse4: FieldConfigPropsByName<
  FormValues,
  'strVal',
  typeof NumberValuedAsFunctionComponentByProps
> = {
  name: 'strVal',
  format: value => parseInt(value, 10),
  parse: value => value.toString(),
  otherProp: '',
};
const { parse: _parse4, ...propsWithoutParse4 } =
  _fieldConfigPropsByName_requiresFormatParse4;
const { format: _format4, ...propsWithoutFormat4 } =
  _fieldConfigPropsByName_requiresFormatParse4;
const { otherProp: _otherProp4, ...propsWithoutOtherProp4 } =
  _fieldConfigPropsByName_requiresFormatParse4;
// @ts-expect-error needs parse
_fieldConfigPropsByName_requiresFormatParse4 = propsWithoutParse4;
// @ts-expect-error needs format
_fieldConfigPropsByName_requiresFormatParse4 = propsWithoutFormat4;
// @ts-expect-error needs otherProp
_fieldConfigPropsByName_requiresFormatParse4 = propsWithoutOtherProp4;
