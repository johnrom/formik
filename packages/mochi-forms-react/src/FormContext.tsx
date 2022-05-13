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
    // helpers
    getState,
    getFieldMeta,
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
    useState,
    subscribe,
    // handlers
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    // config
    validateOnChange,
    validateOnBlur,
    validateOnMount,
    enableReinitialize,
    validationSchema,
    validate,
    TypedField,
    useTypedField,
    TypedFieldArray,
    useTypedFieldArray,
  } = props.value;

  const formApi = React.useMemo<FormApi<Values>>(
    () => ({
      getState,
      getFieldMeta,
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
      useState,
      subscribe,
      TypedField,
      useTypedField,
      TypedFieldArray,
      useTypedFieldArray,
    }),
    [
      getState,
      getFieldMeta,
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
      useState,
      subscribe,
      TypedField,
      useTypedField,
      TypedFieldArray,
      useTypedFieldArray,
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
