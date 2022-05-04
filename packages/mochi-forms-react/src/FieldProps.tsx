import { isObject } from 'lodash';
import { UseFieldPropsByValue } from './Field';
import { FieldMetaProps } from './FieldMeta';
import { useFormApi } from './FormApi';
import { selectFieldOnChange } from './helpers/field-helpers';
import { FormikValues } from './types';
import {
  FieldAsCompatibleComponent,
  FieldAsComponentPropsByComponent,
} from './types/field-as-component-types';

const useFieldPropsIsInput = <
  Values extends FormikValues,
  Value,
  AsField extends FieldAsCompatibleComponent
>(
  props: UseFieldPropsByValue<Values, Value, AsField>
): props is UseFieldPropsByValue<Values, Value, 'input'> => {
  return props.as;
};

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
  {
    name,
    validate,
    parse,
    format,
    formatOnBlur,
    as,
    value,
    ...restProps
  }: UseFieldPropsByValue<Values, Value, AsField>,
  fieldMeta: FieldMetaProps<Value>
): FieldAsComponentPropsByComponent<AsField> => {
  const { handleBlur, setFieldValue, getState } = useFormApi<Values>();
  const valueState = fieldMeta.value;
  const touchedState = fieldMeta.touched;

  const field: FieldAsComponentPropsByComponent<AsField> = {
    ...restProps,
    name,
    value: format?.(fieldMeta.value) ?? fieldMeta.value,
    onBlur: handleBlur,
    onChange: selectFieldOnChange({ setFieldValue, getState }, restProps),
  };

  if (typeof props !== 'string') {
    const {
      type = 'text',
      value: valueProp, // value is special for checkboxes
      as: is,
      multiple,
      format,
      formatOnBlur,
    } = props;

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

    field.onChange = selectFieldOnChange({ setFieldValue, getState }, props);
  }

  return field;
};
