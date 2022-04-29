import * as React from 'react';
import { FormApi, FormSharedConfig, NotOptional } from './types';
import { FormApiContext } from './FormApi';
import { FormConfigContext } from './FormConfig';

export type FormProviderProps<Values> = {
  value: FormApi<Values> & FormSharedConfig<Values>;
};

export const FormProvider = <Values,>(
  props: React.PropsWithChildren<FormProviderProps<Values>>
) => {
  /**
   * Optimize Renders for ContextProviders.
   *
   * NotOptional allows us to enforce that even
   * possibly undefined properties are passed here.
   */
  const {
    // handlers
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    // helpers
    resetForm,
    setErrors,
    setFormikState,
    setFieldTouched,
    setFieldValue,
    setFieldError,
    setStatus,
    setSubmitting,
    setTouched,
    setValues,
    submitForm,
    validateForm,
    validateField,
    unregisterField,
    registerField,
    // state helpers
    getState,
    useState,
    subscribe,
    // config
    validateOnChange,
    validateOnBlur,
    validateOnMount,
    enableReinitialize,
    validationSchema,
    validate,
    TypedField,
    TypedFieldArray,
  } = props.value;

  const formApi = React.useMemo<NotOptional<FormApi<Values>>>(
    () => ({
      handleBlur,
      handleChange,
      handleReset,
      handleSubmit,
      resetForm,
      setErrors,
      setFormikState,
      setFieldTouched,
      setFieldValue,
      setFieldError,
      setStatus,
      setSubmitting,
      setTouched,
      setValues,
      submitForm,
      validateForm,
      validateField,
      unregisterField,
      registerField,
      getState,
      useState,
      subscribe,
      TypedField,
      TypedFieldArray,
    }),
    [
      handleBlur,
      handleChange,
      handleReset,
      handleSubmit,
      resetForm,
      setErrors,
      setFormikState,
      setFieldTouched,
      setFieldValue,
      setFieldError,
      setStatus,
      setSubmitting,
      setTouched,
      setValues,
      submitForm,
      validateForm,
      validateField,
      unregisterField,
      registerField,
      getState,
      useState,
      subscribe,
      TypedField,
      TypedFieldArray,
    ]
  );

  const formConfig = React.useMemo<NotOptional<FormSharedConfig<Values>>>(
    () => ({
      validateOnChange,
      validateOnBlur,
      validateOnMount,
      enableReinitialize,
      validationSchema,
      validate,
    }),
    [
      validateOnChange,
      validateOnBlur,
      validateOnMount,
      enableReinitialize,
      validationSchema,
      validate,
    ]
  );
  return (
    <FormApiContext.Provider value={formApi}>
      <FormConfigContext.Provider value={formConfig}>
        {props.children}
      </FormConfigContext.Provider>
    </FormApiContext.Provider>
  );
};
