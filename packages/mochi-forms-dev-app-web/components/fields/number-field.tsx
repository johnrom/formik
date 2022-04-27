import {
  formatNumberOrEmpty,
  parseNumberOrEmpty,
} from '../../helpers/parse-format-helpers';
import { CustomField, FieldConfig } from '@mochi-forms/react';
import React from 'react';
import { useTypedFields } from '.';
import { NumberAsField } from './number-as-field';

export const NumberField: CustomField<number | ''> = <Values,>(
  props: FieldConfig<number | '', Values>
) => {
  const fields = useTypedFields<Values>();

  return (
    <fields.Field
      type="text"
      name={props.name}
      format={formatNumberOrEmpty}
      parse={parseNumberOrEmpty}
      as={NumberAsField}
    />
  );
};
