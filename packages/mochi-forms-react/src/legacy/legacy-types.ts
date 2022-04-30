import React from 'react';
import { UseFormControllerProps } from '../FormController';
import {
  FormApi,
  FormSharedConfig,
  FormReducerState,
  FormState,
  FormInitialState,
  FormInitialConfig,
  FormEventConfig,
  FormHelpers,
  FormStateHelpers,
  FormFieldHelpers,
  FormHandlers,
  FormComputedState,
  FieldRegistration,
} from '../types';
import { FieldPassThroughConfig } from './LegacyField';

export type FormikConnectedType<Values> = FormikApi<Values> &
  FormSharedConfig<Values> &
  FormikState<Values>;

export type FormikSharedConfig<Values = any> = Omit<
  FormSharedConfig<Values>,
  keyof FormInitialConfig<Values> | keyof FormEventConfig<Values>
>;

export type FormikApi<Values> = FormApi<Values>;
export type FormikReducerState<Values> = FormReducerState<Values>;
export type FormikInitialState<Values> = FormInitialState<Values>;
export type FormikState<Values> = FormState<Values>;
/**
 * @deprecated use FormikComputedState
 */
export type FormikComputedProps = FormComputedState;
export type FormikComputedState = FormComputedState;

export type FormikHelpers<Values> = FormHelpers<Values>;
export type FormikStateHelpers<Values> = FormStateHelpers<Values>;
export type FormikFieldHelpers<Values> = FormFieldHelpers<Values>;
export type FormikHandlers = FormHandlers;
export type FormikRegistration<Values> = FieldRegistration<Values>;

/**
 * State, handlers, and helpers made available to form component or render prop
 * of <Formik/>.
 */
export type FormikProps<Values> = FormikSharedConfig<Values> &
  FormikReducerState<Values> &
  FormikInitialState<Values> &
  FormikHelpers<Values> &
  FormikStateHelpers<Values> &
  FormikFieldHelpers<Values> &
  FormikHandlers &
  FormikComputedState &
  FormikRegistration<Values>;

/**
 * <Formik /> props
 */
export interface FormikConfig<Values> extends UseFormControllerProps<Values> {
  /**
   * Form component to render
   */
  component?: React.ComponentType<FormikProps<Values>>;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   * @deprecated
   */
  render?: (props: FormikProps<Values>) => React.ReactNode;

  /**
   * React children or child render callback
   */
  children?:
    | ((props: FormikProps<Values>) => React.ReactNode)
    | React.ReactNode;

  /** Inner ref */
  innerRef?: React.Ref<FormikProps<Values>>;
}

/**
 * Formik helpers + { props }
 */
export type FormikBag<P, V> = { props: P } & FormHelpers<V>;

/**
 * @deprecated prefer UseFieldProps
 */
export type FieldHookConfig<Value, Values> = {
  as?: any;
} & FieldPassThroughConfig<Value, Values>;
