import React from 'react';
import {
  FieldAsComponent,
  FieldAsComponentProps,
} from '../src/types/field-as-component-types';

export interface FormValues {
  strVal: string;
  numVal: number;
  strOrNumVal: string | number;
}

export const NumberValuedAsFunctionComponentByProps = (
  _props: FieldAsComponentProps<
    number,
    number,
    {
      otherProp: string;
    }
  >
) => null;

export const NumberValuedAsFunctionComponent: FieldAsComponent<
  number,
  number,
  { otherProp: string }
> = (
  _props: FieldAsComponentProps<
    number,
    number,
    {
      otherProp: string;
    }
  >
) => null;

export class NumberValuedClassComponent extends React.Component<
  FieldAsComponentProps<number, number, { otherProp: string }>
> {
  render() {
    return null;
  }
}
