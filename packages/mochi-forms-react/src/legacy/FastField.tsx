import * as React from 'react';
import { FormikValues } from '../types';
import { LegacyField, FieldConfig } from './LegacyField';

/**
 * @deprecated Use Field + FieldConfig
 */
export type FastFieldConfig<Value, Values> = FieldConfig<Value, Values> & {
  shouldUpdate?: (nextProps: any, props: {}) => boolean;
};

/**
 * @deprecated Field now only subscribes to its own slice of Formik's state.
 */
export const FastField = <
  Value extends any = any,
  Values extends FormikValues = any
>({
  shouldUpdate,
  ...props
}: FastFieldConfig<Value, Values>) => (
  <LegacyField {...(props as FieldConfig<Value, Values>)} />
);
