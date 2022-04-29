import { useFormApi } from '../FormApi';
import {
  selectErrors,
  selectInitialErrors,
  selectInitialStatus,
  selectInitialTouched,
  selectInitialValues,
  selectIsDirty,
  selectIsSubmitting,
  selectIsValid,
  selectIsValidating,
  selectStatus,
  selectTouched,
  selectValues,
} from '../helpers/state-selectors';

export const useInitialValues = <Values>() =>
  useFormApi<Values>().useState(selectInitialValues);

export const useInitialTouched = <Values>() =>
  useFormApi<Values>().useState(selectInitialTouched);

export const useInitialErrors = <Values>() =>
  useFormApi<Values>().useState(selectInitialErrors);

export const useInitialStatus = () =>
  useFormApi().useState(selectInitialStatus);

export const useValues = <Values>() =>
  useFormApi<Values>().useState(selectValues);

export const useTouched = <Values>() =>
  useFormApi<Values>().useState(selectTouched);

export const useErrors = <Values>() =>
  useFormApi<Values>().useState(selectErrors);

export const useStatus = () => useFormApi().useState(selectStatus);

export const useIsDirty = () => useFormApi().useState(selectIsDirty);

export const useIsValid = () => useFormApi().useState(selectIsValid);

export const useIsSubmitting = () => useFormApi().useState(selectIsSubmitting);

export const useIsValidating = () => useFormApi().useState(selectIsValidating);
