import React from 'react';
import { LegacyFieldAsComponent } from '../src';
import { FieldAsComponent } from '../src/types/field-as-component-types';
import {
  ChangeEventHandlerResolvedValue,
  FieldConfigAsProp,
  FieldConfigExtraProps,
  FieldConfigFormatProp,
  FieldConfigNameProp,
  FieldConfigParseProp,
  FieldConfigProps,
  FieldConfigPropsByName,
  FieldConfigPropsByValue,
  FieldConfigPropsMatchingName,
  FieldConfigPropsMatchingValue,
  FieldConfigValidateProp,
  FieldConfigValueProps,
  FieldConfigWithoutExtraProps,
} from '../src/types/field-config-types';
import {
  FormValues,
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
const _fieldConfigParseProp: FieldConfigParseProp<string, string> = {};
_fieldConfigParseProp.parse = undefined;
_fieldConfigParseProp.parse = value => value;
// @ts-expect-error zero does not match
_fieldConfigParseProp.parse = value => 0;

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
const _fieldConfigValueProps: FieldConfigValueProps<string, string, string> =
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
  string,
  string,
  React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
> = {};

// @ts-expect-error requires parse because FormattedValue is not assignable to FormValue
let _fieldConfigValueProps_requiringParse: FieldConfigValueProps<
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
  string,
  string,
  string
> = {};
_fieldConfigWithoutExtraProps = {
  validate: (value: string) => '',
  format: value => value,
  parse: value => value,
  value: '',
  formatOnBlur: true,
};
_fieldConfigWithoutExtraProps = {
  // @ts-expect-error value should be string
  validate: (value: number) => '',
  // @ts-expect-error format should return string
  format: value => 0,
  // @ts-expect-error parse should return string
  parse: value => 0,
  // @ts-expect-error value should be string
  value: 0,
  // @ts-expect-error formatOnBlur should be boolean
  formatOnBlur: 0,
};

// @ts-expect-error requires format
let _fieldConfigWithoutExtraProps_requiresFormat: FieldConfigWithoutExtraProps<
  string | number,
  string,
  string
> = {};
_fieldConfigWithoutExtraProps_requiresFormat = {
  format: value => value.toString(),
};

// @ts-expect-error requires parse
let _fieldConfigWithoutExtraProps_requiresParse: FieldConfigWithoutExtraProps<
  string,
  string,
  string | number
> = {};
_fieldConfigWithoutExtraProps_requiresParse = {
  parse: value => value.toString(),
};

let _fieldConfigExtraProps: FieldConfigExtraProps<
  typeof NumberValuedAsFunctionComponentByProps
> = {
  otherProp: '',
};
_fieldConfigExtraProps = {
  // @ts-expect-error otherProp is required
  otherProp: undefined,
};
// @ts-expect-error otherProp is required
_fieldConfigExtraProps = {};
_fieldConfigExtraProps = {
  // @ts-expect-error otherProp should be string
  otherProp: 0,
};

/**
 * FieldConfigProps tests
 */
let fieldConfigProps:
  | FieldConfigProps<string, string, string, { otherProp: string }>
  | undefined;
fieldConfigProps = {
  validate: (_value: string) => {},
  parse: (value: string) => value,
  format: (value: string) => value,
  value: '',
  otherProp: '',
};
const { otherProp: otherProps, ...fieldConfigPropsWithoutOtherProps } =
  fieldConfigProps;
// @ts-expect-error otherProp is required
fieldConfigProps = fieldConfigPropsWithoutOtherProps;
fieldConfigProps = {
  // @ts-expect-error name should match FieldValidator<string>
  validate: (value: number) => {},
  // @ts-expect-error name should match ParseFn<string, string>
  parse: (value: number) => value,
  // @ts-expect-error name should match FormatFn<string, string>
  format: (value: number) => value,
  // @ts-expect-error value should be a string
  value: 0,
  // @ts-expect-error otherProp should be a string
  otherProp: 0,
};

/**
 * FieldConfigPropsMatchingValue tests
 */
let _fieldConfigPropsMatchingValue: FieldConfigPropsMatchingValue<
  string,
  'input'
> = {};
_fieldConfigPropsMatchingValue = { parse: value => value };
// @ts-expect-error input.target.value resolves to string
_fieldConfigPropsMatchingValue = { parse: (value: number) => 0 };
// @ts-expect-error should parse string
_fieldConfigPropsMatchingValue = { parse: value => 0 };
let _fieldConfigPropsMatchingValue_inputNeedsParsing: FieldConfigPropsMatchingValue<
  number,
  'input'
> = {
  parse: value => parseInt(value, 10),
};

// @ts-expect-error the resolved value of input is a string. we need to parse that to a number.
_fieldConfigPropsMatchingValue_inputNeedsParsing = {};

let _fieldConfigPropsMatchingValue_requiresFormatParse: FieldConfigPropsMatchingValue<
  string,
  typeof NumberValuedAsFunctionComponentByProps
> = {
  format: value => parseInt(value, 10),
  parse: value => value.toString(),
  otherProp: '',
};
const { parse: _parse1, ...propsWithoutParse1 } =
  _fieldConfigPropsMatchingValue_requiresFormatParse;
const { format: _format1, ...propsWithoutFormat1 } =
  _fieldConfigPropsMatchingValue_requiresFormatParse;
const { otherProp: _otherProp1, ...propsWithoutOtherProp1 } =
  _fieldConfigPropsMatchingValue_requiresFormatParse;
// @ts-expect-error needs parse
_fieldConfigPropsMatchingValue_requiresFormatParse = propsWithoutParse1;
// @ts-expect-error needs format
_fieldConfigPropsMatchingValue_requiresFormatParse = propsWithoutFormat1;
// @ts-expect-error needs otherProp
_fieldConfigPropsMatchingValue_requiresFormatParse = propsWithoutOtherProp1;

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
_fieldConfigPropsByValue = { name: 'strVal', parse: value => value };
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
  parse: value => parseInt(value, 10),
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
 * FieldConfigPropsMatchingName tests
 */
let _fieldConfigPropsMatchingName: FieldConfigPropsMatchingName<
  FormValues,
  'strVal',
  'input'
> = {};
_fieldConfigPropsMatchingName = { parse: value => value };
// @ts-expect-error input.target.value resolves to string
_fieldConfigPropsMatchingName = { parse: (value: number) => 0 };
// @ts-expect-error should parse string
_fieldConfigPropsMatchingName = { parse: value => 0 };
let _fieldConfigPropsMatchingName_inputNeedsParsing: FieldConfigPropsMatchingName<
  FormValues,
  'numVal',
  'input'
> = {
  parse: value => parseInt(value, 10),
};

// @ts-expect-error the resolved value of input is a string. we need to parse that to a number.
_fieldConfigPropsMatchingName_inputNeedsParsing = {};

let _fieldConfigPropsMatchingName_requiresFormatParse3: FieldConfigPropsMatchingName<
  FormValues,
  'strVal',
  typeof NumberValuedAsFunctionComponentByProps
> = {
  format: value => parseInt(value, 10),
  parse: value => value.toString(),
  otherProp: '',
};
const { parse: _parse3, ...propsWithoutParse3 } =
  _fieldConfigPropsMatchingName_requiresFormatParse3;
const { format: _format3, ...propsWithoutFormat3 } =
  _fieldConfigPropsMatchingName_requiresFormatParse3;
const { otherProp: _otherProp3, ...propsWithoutOtherProp3 } =
  _fieldConfigPropsMatchingName_requiresFormatParse3;
// @ts-expect-error needs parse
_fieldConfigPropsMatchingName_requiresFormatParse3 = propsWithoutParse3;
// @ts-expect-error needs format
_fieldConfigPropsMatchingName_requiresFormatParse3 = propsWithoutFormat3;
// @ts-expect-error needs otherProp
_fieldConfigPropsMatchingName_requiresFormatParse3 = propsWithoutOtherProp3;

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
_fieldConfigPropsByName = { name: 'strVal', parse: value => value };
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
  parse: value => parseInt(value, 10),
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
