import { UseFieldConfigByValue } from '../src';
import { FieldAsComponentPropsByComponent } from '../src/types/field-as-component-types';
import { FormValues, NumberValuedAsFC } from './test-helpers';

const fieldAsComponentMapping_inputToNumberFc = (
  fieldAs: 'input'
): FieldAsComponentPropsByComponent<typeof NumberValuedAsFC> => {
  // @ts-expect-error input props are not compatible with number
  return {
    ...({} as UseFieldConfigByValue<FormValues, string, typeof fieldAs>),
    onBlur: () => {},
    onChange: () => {},
  };
};

const fieldAsComponentMapping_numberFcToInput = (
  fieldAs: typeof NumberValuedAsFC
): FieldAsComponentPropsByComponent<'input'> => {
  // OK: number is assignable to string | number
  return {
    ...({} as UseFieldConfigByValue<FormValues, string, typeof fieldAs>),
    onBlur: () => {},
    onChange: () => {},
  };
};

const UseFieldConfigByValue_input: UseFieldConfigByValue<
  FormValues,
  string,
  'input'
> = {
  name: 'strVal',
};

const fieldAsComponentPropsByComponent_input: FieldAsComponentPropsByComponent<'input'> =
  {
    ...UseFieldConfigByValue_input,
    onBlur: () => {},
    onChange: () => {},
  };

const UseFieldConfigByValue_abstract: UseFieldConfigByValue<
  FormValues,
  string,
  'input'
> = {
  name: 'strVal',
};

const fieldAsComponentPropsByComponent_abstract: FieldAsComponentPropsByComponent<'input'> =
  {
    ...UseFieldConfigByValue_input,
    onBlur: () => {},
    onChange: () => {},
  };

/**
 * todo: I can't figure out how to make these types match up.
 *
 * const fieldAsComponentMapping_generic = <
 *   FieldAs extends AnyFieldAsCompatibleComponent
 * >(
 *   fieldAs: FieldAs
 * ): FieldAsComponentPropsByComponent<typeof fieldAs> => {
 *   return {} as Omit<
 *     UseFieldConfigByValue<FormValues, string, typeof fieldAs>,
 *     keyof FieldConfigPropsByValue<FormValues, string, FieldAs>
 *   > &
 *     Pick<FieldAsComponentPropsByComponent<FieldAs>, 'onChange' | 'onBlur'>;
 * };
 *
 * const fieldAsComponentMapping_anyFieldAsCompatibleComponent = (
 *   fieldAs: AnyFieldAsCompatibleComponent
 * ): FieldAsComponentPropsByComponent<typeof fieldAs> => {
 *   const fieldConfig: UseFieldConfigByValue<FormValues, string, typeof fieldAs> =
 *     {};
 *   return {
 *     ...({} as UseFieldConfigByValue<FormValues, string, typeof fieldAs>),
 *     onBlur: () => {},
 *     onChange: () => {},
 *   };
 * };
 */
