import { isObject } from 'lodash';
import { UseFieldProps } from './Field';
import { FieldMetaProps } from './FieldMeta';
import { useFormApi } from './FormApi';
import { selectFieldOnChange } from './helpers/field-helpers';
import { PathMatchingValue } from './helpers/path-helpers';
import { FieldInputProps, FormikValues, SingleValue } from './types';
import { FieldAsCompatibleComponent } from './types/field-as-component-types';

/**
 * Get props to spread to input elements, like `<input {...fieldProps} />`.
 *
 * Pass `FieldMetaProps` from useFieldMeta, so we don't subscribe twice.
 */
export const useFieldProps = <
  Values extends FormikValues,
  Value,
  AsField extends FieldAsCompatibleComponent
>(
  nameOrOptions:
    | PathMatchingValue<Value, Values>
    | UseFieldProps<Values, Value, AsField>,
  fieldMeta: FieldMetaProps<Value>
): FieldInputProps<Value, Values> => {
  const { handleChange, handleBlur, setFieldValue, getState } =
    useFormApi<Values>();
  const name = isObject(nameOrOptions) ? nameOrOptions.name : nameOrOptions;
  const valueState = fieldMeta.value;
  const touchedState = fieldMeta.touched;

  const field: FieldInputProps<Value, Values> = {
    name,
    // if this isn't a singular value, it should be parsed!
    // however, this is a fallback
    value: valueState as SingleValue<Value>,
    // handleChange isn't a match for onChange for custom value types
    // however, this is a fallback
    onChange: handleChange as any,
    onBlur: handleBlur,
  };

  if (typeof nameOrOptions !== 'string') {
    const {
      type = 'text',
      value: valueProp, // value is special for checkboxes
      as: is,
      multiple,
      format,
      formatOnBlur,
    } = nameOrOptions;

    if (type === 'checkbox') {
      if (valueProp === undefined) {
        field.checked = !!valueState;
      } else {
        field.checked = !!(
          Array.isArray(valueState) && ~valueState.indexOf(valueProp)
        );
        field.value = valueProp;
      }
    } else if (type === 'radio') {
      field.checked = valueState === valueProp;
      // todo: we need to force value on radio and multi-checkbox
      field.value = valueProp!;
    } else if (is === 'select' && multiple) {
      // todo: select isn't actually passed a SingleValue -_-
      field.value = (field.value as any) || [];
      field.multiple = true;
    }

    if (format) {
      if (formatOnBlur === true) {
        if (touchedState === true) {
          field.value = format(field.value, field.name);
        }
      } else {
        field.value = format(field.value, field.name);
      }
    }

    field.onChange = selectFieldOnChange(
      { setFieldValue, getState },
      nameOrOptions
    );
  }

  return field;
};
