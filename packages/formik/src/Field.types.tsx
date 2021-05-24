import * as React from 'react';
import {
  FormikProps,
  FieldMetaProps,
  FieldInputProps,
  FieldValidator,
  PathMatchingValue,
  SingleValue,
  ParseFn,
  FormatFn,
} from './types';

type NoInfer<T> = [T][T extends any ? 0 : never];

export type InputElements = "input" | "textarea" | "select";

export interface FieldHookConfig<Value, Values> extends
  FieldPassThroughConfig<Value, Values>
{
  as?: any
};

export type FieldElements<Value, Values> =
| InputElements
| FieldAsComponent<Value, Values>
| TypedAsField<Value>
| FieldComponentComponent<Value, Values>
| TypedComponentField<Value>;

export type FieldAsElements<Value, Values> =
  | InputElements
  | FieldAsComponent<Value, Values>
  | TypedAsField<Value>;

export type FieldComponentElements<Value, Values> =
  | InputElements
  | FieldComponentComponent<Value, Values>
  | TypedComponentField<Value>;

export type ElementExtraProps<Element extends FieldElements<any, any>, CalculatedProps> =
  Omit<React.ComponentProps<Element>, keyof CalculatedProps>;

export type FieldConfig<Value, Values, Element> =
  FieldAsConfig<Value, Values, Element> |
  FieldComponentConfig<Value, Values, Element> |
  FieldRenderConfig<Value, Values> |
  FieldChildrenConfig<Value, Values> |
  FieldDefaultConfig<Value, Values>;

/**
 * CustomField, AsField, ComponentField definitions
 */
export type CustomField<Value> = <
  Values, Element extends FieldElements<Value, Values>
>(
  props: FieldConfig<Value, Values, Element>
) =>
  React.ReactElement | null;

export type TypedField<Values> = <Value, Element extends FieldElements<Value, Values>>(
  props: FieldConfig<Value, Values, Element>
) =>
  React.ReactElement | null;

export type FieldByValue<Value, Values, Element extends FieldElements<Value, Values>> = (
  props: FieldConfig<Value, Values, Element>
) =>
  React.ReactElement | null;

/**
 * AsField
 */
export interface FieldAsProps<
  Value = any,
  Values = any
> extends
  Omit<FieldPassThroughConfig<Value, Values>, 'value'>,
  FieldInputProps<Value, Values> {}

export type TypedAsField<Value> = <Values>(
  props: React.PropsWithChildren<FieldAsProps<
    Value,
    Values
  >>
) => React.ReactElement | null;

export abstract class FieldAsClass<
  Value,
> extends React.Component<
  FieldAsProps<
    Value,
    any
  >
> {}

/**
 * ComponentField
 */
export interface FieldComponentProps<
  Value = any,
  Values = any
> extends
  FieldPassThroughConfig<Value, Values>,
  LegacyBag<Value, Values> {}

export abstract class FieldComponentClass<
  Value,
> extends React.Component<
  FieldComponentProps<
    Value,
    any
  >
> {}


/**
* @deprecated use `FieldConfig`
*/
export type FieldAttributes<Value, Values, Element extends FieldElements<Value, Values>> =
  FieldConfig<Value, Values, Element>;

/**
 * These props are passed from FieldConfig to FieldProps.
 *
 * @private
 */
export type FieldPassThroughConfig<Value, Values> = {
  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<SingleValue<Value>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<SingleValue<Value>>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<SingleValue<Value>>;

  /**
   * Wait until blur event before formatting input value?
   * @default false
   */
  formatOnBlur?: boolean;

  /**
   * HTML multiple attribute
   */
  multiple?: boolean;

  /**
   * Field name
   */
  name: PathMatchingValue<Value, Values>;

  /** HTML input type */
  type?: string;

  /** checkbox value to match against current value */
  value?: SingleValue<Value>;

  /** Inner ref */
  innerRef?: (instance: any) => void;
}

export type FieldAsComponent<Value, Values> =
  any extends Values
    ? React.ComponentType<any>
    : React.ComponentType<FieldAsProps<
        Value,
        Values
      >>;

export type FieldComponentComponent<Value, Values> =
  any extends Values
  ? React.ComponentType<any>
  : React.ComponentType<FieldComponentProps<
    Value,
    Values
  >>;

/**
 * Passed to `<Field component={Component} />`.
 */
type LegacyBag<Value, Values> = {
  field: FieldInputProps<Value, Values>;
  // if ppl want to restrict this for a given form, let them.
  form: FormikProps<Values>;
}

/**
 * Passed to `render={Function}` or `children={Function}`.
 */
export interface FieldRenderProps<Value = any, Values = any>
  extends LegacyBag<Value, Values>
{
  meta: FieldMetaProps<Value>;
}

export type FieldRenderFunction<Value, Values> = (
  props: FieldRenderProps<Value, Values>
) => React.ReactElement | null;

/**
 * @deprecated Field types do not share common props. Please choose:
 *
 * FieldComponentProps: `field.component = Component`,
 * FieldAsProps: `field.as = Component`,
 * FieldRenderProps: `field.render, field.children = Function`
 */
export type FieldProps<Value, Values> =
  FieldRenderProps<Value, Values>;

export type TypedComponentField<Value> = <Values>(
  props: FieldComponentProps<Value, Values>
) => React.ReactElement | null;

/**
 * `field.as = string`
 *
 * @private
 */
export interface FieldAsConfigRaw<Value, Values, Element> extends
  FieldPassThroughConfig<Value, Values>
{
  children?: React.ReactNode
  as: Element & FieldAsElements<Value, Values>,
  component?: undefined,
  render?: undefined,
}

export type FieldAsConfig<Value, Values, Element> =
  Element extends FieldAsElements<Value, Values>
    ? FieldAsConfigRaw<Value, Values, Element> & ElementExtraProps<Element, FieldInputProps<Value, Values>>
    : never;

/**
 * `field.component = string`
 *
 * @private
 */
export interface FieldComponentConfigRaw<Value, Values, Element> extends
  FieldPassThroughConfig<Value, Values>
{
  children?: React.ReactNode
  component: Element & FieldComponentElements<Value, Values>,
  as?: undefined,
  render?: undefined,
};

export type FieldComponentConfig<Value, Values, Element> =
  Element extends FieldComponentElements<Value, Values>
    ? FieldComponentConfigRaw<Value, Values, Element> & ElementExtraProps<Element, LegacyBag<Value, Values>>
    : never;

/**
 * `field.render = Function`
 *
 * @private
 */
export interface FieldRenderConfig<Value, Values> extends
  FieldPassThroughConfig<Value, Values>
{
  render: FieldRenderFunction<Value, Values>;
  as?: undefined,
  component?: undefined,
  children?: undefined
}

/**
 * `field.children = Function`
 *
 * @private
 */
export interface FieldChildrenConfig<Value, Values> extends
  FieldPassThroughConfig<Value, Values>
{
  children: FieldRenderFunction<Value, Values>;
  as?: undefined,
  component?: undefined,
  render?: undefined,
}

/**
 * no config, `<Field name="">`
 *
 * @private
 */
export interface FieldDefaultConfigRaw<Value, Values> extends
  FieldPassThroughConfig<Value, Values>
{
  as?: undefined,
  component?: undefined,
  render?: undefined,
  children?: undefined,
}

export type FieldDefaultConfig<Value, Values> =
  FieldDefaultConfigRaw<Value, Values> & ElementExtraProps<"input", FieldInputProps<Value, Values>>;
