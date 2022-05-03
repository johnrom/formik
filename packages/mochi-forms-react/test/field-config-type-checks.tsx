import React from 'react';
import {
  FieldConfigAsProp,
  FieldConfigNameProp,
  FieldConfigValueProps,
} from '../src/types/field-config-types';
import { FormValues } from './test-helpers';

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

const _fieldConfigValueProps: FieldConfigValueProps<string, string, string> =
  {};
_fieldConfigValueProps.parse = value => value;
_fieldConfigValueProps.format = value => value;
// @ts-expect-error parse must return string
_fieldConfigValueProps.parse = value => 0;
// @ts-expect-error format must return string
_fieldConfigValueProps.format = value => 0;
_fieldConfigValueProps.validate = _value => '';
_fieldConfigValueProps.validate = _value => {};
_fieldConfigValueProps.validate = _value => Promise.resolve('');
_fieldConfigValueProps.validate = _value => Promise.resolve();
// @ts-expect-error validate requires string | void
_fieldConfigValueProps.validate = value => 0;
// @ts-expect-error validate requires Promise<string | void>
_fieldConfigValueProps.validate = _value => Promise.resolve(0);

// @ts-expect-error requires parse because FormattedValue is not assignable to FormValue
const _fieldConfigValueProps_requiringParse: FieldConfigValueProps<
  string,
  JSX.IntrinsicElements['input']['value'],
  React.ChangeEvent<HTMLInputElement>
> = {};
_fieldConfigValueProps_requiringParse.parse = value => value.toString();

// @ts-expect-error requires format because FormValue is not assignable to FormattedValue
const _fieldConfigValueProps_requiringFormat: FieldConfigValueProps<
  JSX.IntrinsicElements['input']['value'],
  string,
  React.ChangeEvent<HTMLInputElement>
> = {};
_fieldConfigValueProps_requiringParse.format = value => value.toString();
