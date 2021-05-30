import { Field } from "./Field";
import { FieldConfig } from './Field.types';
import React from "react";
import { PathOf, ValueMatchingPath } from "./types";

export type TypedFieldConfig<Values, Path extends PathOf<Values>, Element> = { name: Path }
  & FieldConfig<ValueMatchingPath<Values, Path>, Values, Element>;

export type TypedField<Values> = <Path extends PathOf<Values>, Element>(
  props: TypedFieldConfig<Values, Path, Element>
) =>
  React.ReactElement | null;

/**
 * Create a typed field from anywhere.
 */
 export const createTypedField = <Values,>(
    FieldType: TypedField<Values> = Field
  ): TypedField<Values> => FieldType;

  /**
   * Create a TypedField from within Formik.
   *
   * @private
   */
  export const useTypedField = <Values,>(
    FieldType: TypedField<Values> = Field
  ) => React.useMemo(
    () => createTypedField<Values>(FieldType),
    []
  );
