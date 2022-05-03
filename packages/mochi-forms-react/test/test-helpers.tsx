import { FieldAsComponentProps } from '../src/types/field-as-component-types';

export interface FormValues {
  strVal: string;
  numVal: number;
  strOrNumVal: string | number;
}

export const NumberValuedAsComponent = (
  _props: FieldAsComponentProps<
    number,
    number,
    {
      otherProp: string;
    }
  >
) => null;
