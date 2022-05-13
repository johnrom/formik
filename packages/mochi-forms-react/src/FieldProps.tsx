import { UseFieldConfigByValue } from './Field';
import { FieldMetaProps } from './FieldMeta';
import { useFormApi } from './FormApi';
import { useEventCallback } from './hooks/useEventCallback';
import { FormikValues, EventOrValue } from './types';
import {
  AnyFieldAsCompatibleComponent,
  FieldAsComponentCompatibleProps,
  FieldAsComponentFormattedValue,
  FieldAsComponentPropsByComponent,
} from './types/field-as-component-types';
import {
  ChangeEventHandlerEvent,
  FieldConfigAsProp,
} from './types/field-config-types';

const isFieldConfigMatchingInput = <Values, Value>(
  fieldConfig: FieldConfigAsProp<AnyFieldAsCompatibleComponent>
): fieldConfig is UseFieldConfigByValue<Values, Value, 'input'> => {
  return fieldConfig.as === 'input';
};

const isFieldPropsMatchingInput = (
  _fieldProps: FieldAsComponentCompatibleProps,
  fieldConfig: FieldConfigAsProp<AnyFieldAsCompatibleComponent>
): _fieldProps is FieldAsComponentPropsByComponent<'input'> => {
  return fieldConfig.as === 'input';
};

const isFieldConfigMatchingSelect = <Values, Value>(
  fieldConfig: FieldConfigAsProp<AnyFieldAsCompatibleComponent>
): fieldConfig is UseFieldConfigByValue<Values, Value, 'select'> => {
  return fieldConfig.as === 'select';
};

const isFieldPropsMatchingSelect = (
  _fieldProps: FieldAsComponentCompatibleProps,
  fieldConfig: FieldConfigAsProp<AnyFieldAsCompatibleComponent>
): _fieldProps is FieldAsComponentPropsByComponent<'select'> => {
  return fieldConfig.as === 'select';
};

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
  const formApi = useFormApi<Values>();
  const { handleChange, handleBlur } = formApi;
  const valueState = fieldMeta.value;
  const touchedState = fieldMeta.touched;
  /**
   * todo: This works when passing props for some reason, but after
   * omitting TS is no longer able to tell that the types should match.
   *
   * this works:
   *
   * ```
   * const fieldProps: FieldAsComponentPropsByComponent<FieldAs> = props;
   * ```
   *
   * unfortunately we have to use a type assertion
   */
  const { as, validate, parse, format, formatOnBlur, ...fieldPropsFromProps } =
    props;

  const onChange = useEventCallback(
    (
      value: ChangeEventHandlerEvent<React.ComponentProps<FieldAs>['onChange']>
    ) => {
      /**
       * todo: This should work, but I can't figure it out. Maybe TypeScript has broken down at this point.
       */
      const parsedValue = (parse?.(value, props.name, formApi) ??
        value) as EventOrValue<Value>;

      handleChange(props.name, parsedValue);
    }
  );

  const fieldProps: FieldAsComponentPropsByComponent<FieldAs> = {
    ...(fieldPropsFromProps as FieldAsComponentPropsByComponent<FieldAs>),
    onChange,
    handleBlur,
  };

  if (
    isFieldConfigMatchingInput<Values, Value>(props) &&
    isFieldPropsMatchingInput(fieldProps, props)
  ) {
    const { type = 'text', value: valueProp } = props;

    if (type === 'checkbox') {
      if (valueProp === undefined) {
        fieldProps.checked = !!valueState;
      } else {
        fieldProps.checked = !!(
          Array.isArray(valueState) && ~valueState.indexOf(valueProp)
        );
        fieldProps.value = valueProp;
      }
    } else if (type === 'radio') {
      fieldProps.checked = valueState === valueProp;
      fieldProps.value = valueProp;
    }
  } else if (
    isFieldConfigMatchingSelect<Values, Value>(props) &&
    isFieldPropsMatchingSelect(fieldProps, props) &&
    props.multiple
  ) {
    fieldProps.value = (fieldProps.value as any) || [];
    fieldProps.multiple = true;
  } else {
    /**
     * todo: This should work, but I can't figure it out. Maybe TypeScript has broken down at this point.
     */
    const formattedValue = (
      format && (!formatOnBlur || touchedState)
        ? format(valueState, props.name)
        : valueState
    ) as FieldAsComponentFormattedValue<FieldAs>;

    fieldProps.value = formattedValue;
  }

  return fieldProps;
};
