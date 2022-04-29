import { FormState } from '../types';

export const selectFullState = <T>(state: T) => state;

export const selectInitialValues = <Values>(state: FormState<Values>) =>
  state.initialValues;

export const selectInitialTouched = <Values>(state: FormState<Values>) =>
  state.initialTouched;

export const selectInitialErrors = <Values>(state: FormState<Values>) =>
  state.initialErrors;

export const selectInitialStatus = (state: FormState<any>) =>
  state.initialStatus;

export const selectValues = <Values>(state: FormState<Values>) => state.values;

export const selectTouched = <Values>(state: FormState<Values>) =>
  state.touched;

export const selectErrors = <Values>(state: FormState<Values>) => state.errors;

export const selectStatus = (state: FormState<any>) => state.status;

export const selectIsDirty = (state: FormState<any>) => state.dirty;

export const selectIsValid = (state: FormState<any>) => state.isValid;

export const selectIsSubmitting = (state: FormState<any>) => state.isSubmitting;

export const selectIsValidating = (state: FormState<any>) => state.isValidating;
