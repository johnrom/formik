import React from 'react';
import {
  ComponentMaybeAcceptingProps,
  ComponentNeverRequiringProps,
} from '../helpers/type-helpers';
import { FieldOnBlurProp, FieldOnChangeProp } from '../types';
import { ChangeEventHandlerEvent } from './field-config-types';

/**
 * A FieldAsComponent may required a name prop, but it doesn't have to.
 */
export interface FieldAsComponentNameProp {
  name?: string;
}

export interface FieldAsComponentValueProp<FormattedValue> {
  /** Formatted value that the `FieldAsComponent` receives */
  value?: FormattedValue;
}

export interface FieldAsComponentOnChangeProp<ChangeHandlerValue> {
  /** Change event handler */
  onChange?: FieldOnChangeProp<ChangeHandlerValue>;
}

export interface FieldAsComponentOnBlurProp {
  /** Blur event handler */
  onBlur?: FieldOnBlurProp;
}

export interface FieldAsComponentValueProps<FormattedValue, ChangeHandlerValue>
  extends FieldAsComponentValueProp<FormattedValue>,
    FieldAsComponentOnChangeProp<ChangeHandlerValue> {}

export interface FieldAsComponentOnlyProps<ChangeHandlerValue>
  extends FieldAsComponentNameProp,
    FieldAsComponentOnChangeProp<ChangeHandlerValue>,
    FieldAsComponentOnBlurProp {}

export type FieldAsComponentPassThroughProps<FormattedValue, ExtraProps> =
  FieldAsComponentValueProp<FormattedValue> & ExtraProps;

export type FieldAsCompatibleNamePropByComponent<
  FieldAs extends React.ElementType<any>
> = React.ComponentProps<FieldAs> extends Partial<FieldAsComponentNameProp>
  ? FieldAs
  : FieldAsComponentNameProp extends Partial<React.ComponentProps<FieldAs>>
  ? FieldAs
  : never;

/**
 * A FieldAsComponent may never require these props, because they are FieldConfig-only props and will be removed
 */
export type FieldAsCompatibleExcludedProps = {
  validate: undefined;
  parse: undefined;
  format: undefined;
  formatOnBlur: undefined;
  as: undefined;
};

/**
 * A component is compatible with `<Field as={}>` if it accepts the `FieldAsComponentProps` API.
 *
 * We'll infer the values it accepts to build `FieldConfigProps`.
 */
export type FieldAsComponentCompatibleProps = FieldAsComponentNameProp &
  FieldAsComponentOnBlurProp &
  FieldAsComponentValueProps<any, any>;

/**
 * This is a quick and dirty check to make sure it's a component.
 */
export type AnyFieldAsCompatibleComponent = React.ElementType<any>;

/**
 * This is the real check to resolve the correct type of a FieldAsCompatibleComponent.
 */
export type FieldAsCompatibleComponent<
  FieldAs extends AnyFieldAsCompatibleComponent
> = ComponentMaybeAcceptingProps<FieldAs, FieldAsComponentCompatibleProps> &
  ComponentNeverRequiringProps<FieldAs, keyof FieldAsCompatibleExcludedProps>;

/**
 * I thought I could force certain props to be present here.
 * However, it doesn't seem to be an issue because we will enforce the correct props later.
 *
 * Keeping the type around in case I discover a way to force this.
 */
export type FieldAsCompatibleComponentByComponent<
  FieldAs extends React.ElementType<any> = React.ElementType<any>
> = FieldAsCompatibleNamePropByComponent<FieldAs>;

export type FieldAsComponentFormattedValue<
  FieldAs extends AnyFieldAsCompatibleComponent
> = [React.ComponentProps<FieldAs>] extends [
  FieldAsComponentValueProps<infer FormattedValue, infer _ChangeHandlerValue>
]
  ? FormattedValue
  : never;

export type FieldAsComponentChangeHandlerValue<
  FieldAs extends AnyFieldAsCompatibleComponent
> = [React.ComponentProps<FieldAs>] extends [
  FieldAsComponentValueProps<infer _FormattedValue, infer ChangeHandlerValue>
]
  ? ChangeHandlerValue
  : never;

export type FieldAsComponentExtraProps<
  FieldAs extends AnyFieldAsCompatibleComponent
> = Omit<React.ComponentProps<FieldAs>, keyof FieldAsComponentCompatibleProps>;

export type FieldAsComponentProps<
  FormattedValue,
  ChangeHandlerValue,
  ExtraProps
> = FieldAsComponentOnlyProps<ChangeHandlerValue> &
  FieldAsComponentPassThroughProps<FormattedValue, ExtraProps>;

export type FieldAsComponent<FormattedValue, ChangeHandlerValue, ExtraProps> =
  React.ComponentType<
    FieldAsComponentProps<FormattedValue, ChangeHandlerValue, ExtraProps>
  >;

export type FieldAsComponentOnlyPropsByComponent<
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldAsComponentOnlyProps<
  ChangeEventHandlerEvent<React.ComponentProps<FieldAs>['onChange']>
>;

export type FieldAsComponentPassThroughPropsByComponent<
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldAsComponentPassThroughProps<
  FieldAsComponentFormattedValue<FieldAs>,
  FieldAsComponentExtraProps<FieldAs>
>;

export type FieldAsComponentPropsByComponent<
  FieldAs extends AnyFieldAsCompatibleComponent
> = FieldAsComponentPassThroughPropsByComponent<FieldAs> &
  FieldAsComponentOnlyPropsByComponent<FieldAs>;

/**
 * This is assignable to any type which requires a FieldAsComponent matching values.
 * This does not resolve to a specific component to infer values.
 */
export type AnyFieldAsComponentMatchingValues<
  FormattedValue,
  ChangeHandlerValue
> = React.ElementType<
  FieldAsComponentValueProps<FormattedValue, ChangeHandlerValue>
>;
