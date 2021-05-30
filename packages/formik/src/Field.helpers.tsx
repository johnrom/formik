import * as React from "react";
import {
  CustomField,
  FieldByValue,
  FieldElements,
  TypedField
} from "./Field.types";

/**
 * Create a Field<Value, Values> from a CustomField<Value>.
 */
export const createCustomField = <Values,>() => <Value, Element extends FieldElements<Value, Values>>(
  FieldType: CustomField<Value>
): FieldByValue<Value, Values, Element> =>
  (props) => <FieldType<Values, Element> {...props as any} />;

/**
 * Use a CustomField<Value> as Field<Value, Values>.
 */
export const useCustomField = <Values,>() => <Value, Element extends FieldElements<Value, Values>>(
  FieldType: CustomField<Value>
) => React.useMemo(
  () => createCustomField<Values>()<Value, Element>(FieldType),
  [FieldType]
);
