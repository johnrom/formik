import * as React from 'react';
import {
  FormikProps,
  FieldMetaProps,
  FieldInputProps,
  FieldValidator,
  SingleValue,
  ParseFn,
  FormatFn,
  ValueMatchingPath,
  PathOf,
  PathMatchingValue,
} from './types';

export type InputElements = "input" | "textarea" | "select";

export interface FieldHookConfig<Values, Path extends PathOf<Values>> extends
  FieldPassThroughConfig<Values, Path>
{
  as?: any
};

export type FieldElements<Values, Path extends PathOf<Values>> =
  | InputElements
  | React.JSXElementConstructor<FieldAsProps<ValueMatchingPath<Values, Path>, Values>>;

export type ElementExtraProps<Element extends FieldElements<any, any>, CalculatedProps> = Omit<React.ComponentProps<Element>,
keyof CalculatedProps>;

export type FieldConfig<
  Values,
  Path extends PathOf<Values>,
  Element extends FieldElements<Values, Path>
> =
    (FieldAsConfig<Values, Path, Element> & ElementExtraProps<Element, FieldInputProps<any, any>>)
    | (FieldDefaultConfig<Values, Path> & ElementExtraProps<"input", FieldInputProps<any, any>>)
    | FieldRenderConfig<Values, Path>
    | FieldChildrenConfig<Values, Path>;

/**
 * CustomField, AsField, ComponentField definitions
 */
export type CustomField<Value> = <
  Values,
  Element extends FieldElements<Values, PathMatchingValue<Value, Values>>
>(
  props: FieldConfig<Values, PathMatchingValue<Value, Values>, Element>
) =>
  React.ReactElement | null;

export type TypedField<Values> = <Path extends PathOf<Values>, Element extends FieldElements<Values, Path>>(
  props: FieldConfig<Values, Path, Element>
) =>
  React.ReactElement | null;

export type FieldByValue<Value, Values, Element extends FieldElements<Values, PathMatchingValue<Value, Values>>> = (
  props: FieldConfig<Values, PathMatchingValue<Value, Values>, Element>
) =>
  React.ReactElement | null;

/**
 * AsField
 */
export interface FieldAsProps<
  Value = any,
  Values = any
> extends
  Omit<FieldPassThroughConfig<Values, PathMatchingValue<Value, Values>>, 'value'>,
  FieldInputProps<Value, Values> {};

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
  Values = any,
  Path extends PathOf<Values> = any,
> extends FieldPassThroughConfig<Values, Path>,
  LegacyBag<Values, Path> {};

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
export type FieldAttributes<Values, Path extends PathOf<Values>, Element extends FieldElements<Values, Path>> =
  FieldConfig<Values, Path, Element>;

/**
 * These props are passed from FieldConfig to FieldProps.
 *
 * @private
 */
export type FieldPassThroughConfig<Values, Path extends PathOf<Values>> = {
  /**
   * Validate a single field value independently
   */
  validate?: FieldValidator<SingleValue<ValueMatchingPath<Values, Path>>>;

  /**
   * Function to parse raw input value before setting it to state
   */
  parse?: ParseFn<SingleValue<ValueMatchingPath<Values, Path>>>;

  /**
   * Function to transform value passed to input
   */
  format?: FormatFn<SingleValue<ValueMatchingPath<Values, Path>>>;

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
  name: Path;

  /** HTML input type */
  type?: string;

  /** checkbox value to match against current value */
  value?: SingleValue<ValueMatchingPath<Values, Path>>;

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

/**
 * Passed to `<Field component={Component} />`.
 */
type LegacyBag<Values, Path extends PathOf<Values>> = {
  field: FieldInputProps<ValueMatchingPath<Values, Path>, Values>;
  // if ppl want to restrict this for a given form, let them.
  form: FormikProps<Values>;
}

/**
 * Passed to `render={Function}` or `children={Function}`.
 */
export interface FieldRenderProps<Values = any, Path extends PathOf<Values> = any>
  extends LegacyBag<Values, Path>
{
  meta: FieldMetaProps<ValueMatchingPath<Values, Path>>;
}

export type FieldRenderFunction<Values, Path extends PathOf<Values>> = (
  props: FieldRenderProps<Values, Path>
) => React.ReactElement | null;

/**
 * @deprecated Field types do not share common props. Please choose:
 *
 * FieldComponentProps: `field.component = Component`,
 * FieldAsProps: `field.as = Component`,
 * FieldRenderProps: `field.render, field.children = Function`
 */
export type FieldProps<Values, Path extends PathOf<Values>> =
  FieldRenderProps<Values, Path>;

/**
 * `field.as = Component`
 *
 * @private
 */
export interface FieldAsConfig<Values, Path extends PathOf<Values>, Element> extends
  FieldPassThroughConfig<Values, Path>
{
  children?: React.ReactNode
  as: Element;
  component?: undefined,
  render?: undefined,
};

/**
 * `field.render = Function`
 *
 * @private
 */
export interface FieldRenderConfig<Values, Path extends PathOf<Values>> extends
  FieldPassThroughConfig<Values, Path>
{
  render: FieldRenderFunction<Values, Path>;
  as?: undefined,
  component?: undefined,
  children?: undefined
}

/**
 * `field.children = Function`
 *
 * @private
 */
export interface FieldChildrenConfig<Values, Path extends PathOf<Values>> extends
  FieldPassThroughConfig<Values, Path>
{
  children: FieldRenderFunction<Values, Path>;
  as?: undefined,
  component?: undefined,
  render?: undefined,
}

/**
 * no config, `<Field name="">`
 *
 * @private
 */
export interface FieldDefaultConfig<Values, Path extends PathOf<Values>> extends
  FieldPassThroughConfig<Values, Path>
{
  as?: undefined,
  component?: undefined,
  render?: undefined,
  children?: undefined,
}
