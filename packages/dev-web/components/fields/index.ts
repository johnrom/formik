import { NumberField } from './number-field';
import {
    createCustomField,
    createTypedField,
    createTypedFieldArray
} from '@johnrom/formik-v3';
import { useMemo } from 'react';

export const createTypedFields = <Values,>() => ({
    Field: createTypedField<Values>(),
    FieldArray: createTypedFieldArray<Values>(),
    NumberField: createCustomField<Values>()(NumberField),
});

export const useTypedFields = <Values,>() =>
    useMemo(() => createTypedFields<Values>(), []);
