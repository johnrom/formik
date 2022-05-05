import { UseFieldConfigByValue } from './Field';
import { FieldMetaProps } from './FieldMeta';
import { useFormApi } from './FormApi';
import { selectFieldOnChange } from './helpers/field-helpers';
import { FormikValues } from './types';
import {
  AnyFieldAsCompatibleComponent,
  FieldAsComponentPropsByComponent,
} from './types/field-as-component-types';

/**
 * Get props to spread to input elements, like `<input {...fieldProps} />`.
 *
 * Pass `FieldMetaProps` from useFieldMeta, so we don't subscribe twice.
 */
export const useFieldProps = <
  Values extends FormikValues,
  Value,
  FieldAs extends AnyFieldAsCompatibleComponent
>(
  props: UseFieldConfigByValue<Values, Value, FieldAs>,
  fieldMeta: FieldMetaProps<Value>
): FieldAsComponentPropsByComponent<FieldAs> => {
  const { handleChange, handleBlur, setFieldValue, getState } =
    useFormApi<Values>();
  const valueState = fieldMeta.value;
  const touchedState = fieldMeta.touched;

  /**
   * todo: This works when passing props for some reason, but after
   * omitting TS is no longer able to tell that the types should match.
   *
   * // this works
   * const fieldProps: FieldAsComponentPropsByComponent<FieldAs> = props;
   */
  const { as, validate, parse, format, formatOnBlur, ...fieldPropsFromProps } =
    props;
  const fieldProps: FieldAsComponentPropsByComponent<FieldAs> =
    fieldPropsFromProps as FieldAsComponentPropsByComponent<FieldAs>;

  /**
   * todo: type handleChange<Value>(props.name) and then implement a default formatter
   *
   * should the formatter actually allow you to map the props themselves?!
   * that would allow us to do make `field.checked` etc, dynamic and configurable.
   * it could also allow us to map onChange to onChangeText for React Native
   */

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

    field.onChange = selectFieldOnChange(
      { setFieldValue, getState },
      field.name
    );
  }

  return fieldProps;
};
