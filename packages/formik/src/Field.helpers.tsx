import * as React from "react";
import { PathMatchingValue } from "../dist";
import { Field } from "./Field";
import {
  CustomField,
  FieldByValue,
  FieldElements,
  TypedField
} from "./Field.types";

/**
 * Create a Field<Value, Values> from a CustomField<Value>.
 */
export const createCustomField = <Values,>() => <Value, Element extends FieldElements<Values, PathMatchingValue<Value, Values>>>(
  FieldType: CustomField<Value>
): FieldByValue<Value, Values, Element> =>
  (props) => <FieldType<Values, Element> {...props} />;

/**
 * Use a CustomField<Value> as Field<Value, Values>.
 */
export const useCustomField = <Values,>() => <Value,>(
  FieldType: CustomField<Value>
) => React.useMemo(
  () => createCustomField<Values>()(FieldType),
  [FieldType]
);

/**
 * Create a typed field from anywhere.
 */
export const createTypedField = <Values,>(
  FieldType: TypedField<Values> = Field as any
): TypedField<Values> => FieldType;

/**
 * Create a TypedField from within Formik.
 *
 * @private
 */
export const useTypedField = <Values,>(
  FieldType: TypedField<Values> = Field as any
) => React.useMemo(
  () => createTypedField<Values>(FieldType),
  []
);
