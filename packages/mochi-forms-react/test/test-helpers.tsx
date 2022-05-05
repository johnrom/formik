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

export const NumberValuedAsFC: FieldAsComponent<
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

export const noPropsFc = () => null;
export const anyPropsFc = (props: any) => null;
export const optionalNameFC = (props: { name?: string }) => null;
export const requiredNameFC = (props: { name: string }) => null;
export const optionalOnChangeFC = (props: { onChange?: () => void }) => null;
export const requiredOnChangeFC = (props: { onChange: () => void }) => null;
export const optionalOtherPropFC = (props: { otherProp?: string }) => null;
export const requiredOtherPropFC = (props: { otherProp: string }) => null;
export const optionalWithOtherPropFC = (props: { name?: string, onChange?: () => void, otherProp?: string }) => null;
export const requiredWithOtherPropFC = (props: { name: string, onChange: () => void, otherProp: string }) => null;
export const optionalValidateFC = (props: { onChange?: () => void, validate?: boolean }) => null;
export const badNameFC = (props: { name: boolean }) => null;
export const badOnChangeFC = (props: { onChange: boolean }) => null;
export const requiredValidateFC = (props: { onChange?: () => void, validate: boolean }) => null;