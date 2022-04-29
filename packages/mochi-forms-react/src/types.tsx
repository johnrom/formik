import * as React from 'react';
import { Comparer, Selector } from 'use-optimized-selector';
import { TypedField } from './Field.types';
import { TypedFieldArray } from './FieldArray.types';
import {
  PathMatchingValue,
  PathOf,
  PathLikeValue,
} from './helpers/path-helpers';

export type ParseFn<Value> = (value: unknown, name: string) => Value;
export type FormatFn<Value> = (value: Value, name: string) => any;

export type SingleValue<Value> = Value extends (infer SingleValue)[]
  ? SingleValue
  : Value;

export type InputElements = 'input' | 'textarea' | 'select';

/**
 * Values of fields in the form
 */
export interface FormikValues {
  [field: string]: any;
}
/**
 * An object containing error messages whose keys correspond to FormikValues.
 * Should always be an object of strings, but any is allowed to support i18n libraries.
 */
export type FormikErrors<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object // [number] is the special sauce to get the type of array's element. More here https://github.com/Microsoft/TypeScript/pull/21316
      ? FormikErrors<Values[K][number]>[] | string | string[]
      : string | string[]
    : Values[K] extends object
    ? FormikErrors<Values[K]>
    : string;
};

/**
 * An object containing touched state of the form whose keys correspond to FormikValues.
 */
export type FormikTouched<Values> = {
  [K in keyof Values]?: Values[K] extends any[]
    ? Values[K][number] extends object // [number] is the special sauce to get the type of array's element. More here https://github.com/Microsoft/TypeScript/pull/21316
      ? FormikTouched<Values[K][number]>[]
      : boolean
    : Values[K] extends object
    ? FormikTouched<Values[K]>
    : boolean;
};

/**
 * Formik state tree
 */
export interface FormikCurrentState<Values> {
  /** Form values */
  values: Values;
  /** map of field names to specific error for that field */
  errors: FormikErrors<Values>;
  /** map of field names to whether the field has been touched */
  touched: FormikTouched<Values>;
  /** whether the form is currently submitting */
  isSubmitting: boolean;
  /** whether the form is currently validating (prior to submission) */
  isValidating: boolean;
  /** Top level status state, in case you need it */
  status?: any;
  /** Number of times user tried to submit the form */
  submitCount: number;
}

export interface FormInitialState<Values> {
  initialValues: FormInitialConfig<Values>['initialValues'];
  initialErrors: FormInitialConfig<Values>['initialErrors'];
  initialTouched: FormInitialConfig<Values>['initialTouched'];
  initialStatus: FormInitialConfig<Values>['initialStatus'];
}

export type FormReducerState<Values> = FormInitialState<Values> &
  FormikCurrentState<Values>;

export type FormikMessage<Values> =
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'SUBMIT_FAILURE' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SET_ISVALIDATING'; payload: boolean }
  | { type: 'SET_ISSUBMITTING'; payload: boolean }
  | { type: 'SET_VALUES'; payload: Values }
  | { type: 'SET_FIELD_VALUE'; payload: { field: string; value?: any } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { field: string; value?: boolean } }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; value?: string } }
  | { type: 'SET_TOUCHED'; payload: FormikTouched<Values> }
  | { type: 'SET_ERRORS'; payload: FormikErrors<Values> }
  | { type: 'SET_STATUS'; payload: any }
  | {
      type: 'SET_FORMIK_STATE';
      payload: (s: FormReducerState<Values>) => FormReducerState<Values>;
    }
  | {
      type: 'RESET_FORM';
      payload: Partial<FormReducerState<Values>>;
    };

/**
 * Formik computed state. These are read-only and
 * result from updates to FormikState but do not live there.
 */
export interface FormComputedState {
  /**
   * True if `!isEqual(initialValues, state.values)`
   */
  readonly dirty: boolean;
  /**
   * True if one of:
   * `dirty && state.errors is empty` or
   * `!dirty && isInitialValid`
   */
  readonly isValid: boolean;
}

export type FormState<Values> = FormReducerState<Values> & FormComputedState;

export type GetStateFn<Values> = () => FormState<Values>;

export type SubscriptionCallbackFn = () => void;
export type FormikSubscribeFn = (
  callback: SubscriptionCallbackFn
) => () => void;

export type RegisterFieldFn<Values> = <Value>(
  name: PathMatchingValue<Value, Values>,
  args: { validate?: FieldValidator<SingleValue<Value>> }
) => void;

export type UnregisterFieldFn<Values> = <Path extends PathOf<Values>>(
  name: Path
) => void;

/**
 * Formik state helpers
 */
export type SetStatusFn = (status: any) => void;

export type SetErrorsFn<Values extends FormikValues> = (
  errors: FormikErrors<Values>
) => void;

export type SetSubmittingFn = (isSubmitting: boolean) => void;

export type SetTouchedFn<Values extends FormikValues> = (
  touched: FormikTouched<Values>,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<Values>>;

export type SetValuesFn<Values extends FormikValues> = (
  values: React.SetStateAction<Values>,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<Values>>;

export type SetFieldValueFn<Values extends FormikValues> = <Value>(
  field: PathLikeValue<Value, Values> | PathMatchingValue<Value, Values>,
  value: Value,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<Values>>;

export type SetFieldErrorFn<Values> = <Path extends PathOf<Values>>(
  field: Path,
  error: string | undefined
) => void;

export type SetFieldTouchedFn<Values extends FormikValues> = <
  Path extends PathOf<Values>
>(
  field: Path,
  touched?: boolean | undefined,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<Values>>;

export type ValidateFormFn<Values extends FormikValues> = (
  values?: Values
) => Promise<FormikErrors<Values>>;

export type ValidateFieldFn<Values> = <Path extends PathOf<Values>>(
  name: Path
) => Promise<void | string | undefined>;

export type ResetFormFn<Values extends FormikValues> = (
  nextState?: Partial<FormReducerState<Values>> | undefined
) => void;

export type SetFormikStateFn<Values extends FormikValues> = (
  stateOrCb:
    | FormReducerState<Values>
    | ((state: FormReducerState<Values>) => FormReducerState<Values>)
) => void;

export type SubmitFormFn = () => Promise<any>;

export interface FormHelpers<Values> {
  /** Manually set top level status. */
  setStatus: SetStatusFn;
  /** Manually set errors object */
  setErrors: SetErrorsFn<Values>;
  /** Manually set isSubmitting */
  setSubmitting: SetSubmittingFn;
  /** Manually set touched object */
  setTouched: SetTouchedFn<Values>;
  /** Manually set values object  */
  setValues: SetValuesFn<Values>;
  /** Set value of form field directly */
  setFieldValue: SetFieldValueFn<Values>;
  /** Set error message of a form field directly */
  setFieldError: SetFieldErrorFn<Values>;
  /** Set whether field has been touched directly */
  setFieldTouched: SetFieldTouchedFn<Values>;
  /** Validate form values */
  validateForm: ValidateFormFn<Values>;
  /** Validate field value */
  validateField: ValidateFieldFn<Values>;
  /** Reset form */
  resetForm: ResetFormFn<Values>;
  /** Submit the form imperatively */
  submitForm: SubmitFormFn;
  /** Set Formik state, careful! */
  setFormikState: SetFormikStateFn<Values>;
}

export interface FormStateHelpers<Values> {
  /** Get Formik State from outside of Render. */
  getState: GetStateFn<Values>;
  /**
   * Subscribe to changes when Formik updates.
   *
   * Probably avoid using this, instead use `useFormikSubscriptionByRef(formikRef.current, initialValues, selector, comparer)`
   */
  subscribe: FormikSubscribeFn;
  /** Use Formik State from within Render. */
  useState: <Return = FormState<Values>>(
    selector?: Selector<FormState<Values>, Return>,
    comparer?: Comparer<Return>,
    shouldSubscribe?: boolean
  ) => Return;
}

export type HandleSubmitFn = (
  e?: React.FormEvent<HTMLFormElement> | undefined
) => void;

export type HandleResetFn = (e?: any) => void;

/**
 * Event callback returned by `formik.handleBlur`.
 */
export type HandleBlurEventFn = (event: React.FocusEvent<any>) => void;

/**
 * Type of `formik.handleBlur`.
 * May be an event callback, or accept a field name and return an event callback.
 */
export type HandleBlurFn = {
  (eventOrString: string): HandleBlurEventFn;
  // Must remain the same as HandleBlurEventFn
  (event: React.FocusEvent<any>): void;
};

/**
 * Event callback returned by `formik.handleChange`.
 */
export type HandleChangeEventFn = (
  event: React.ChangeEvent<any> | string
) => void;

/**
 * Type of `formik.handleChange`.
 * May be an event callback, or accept a field name and return an event callback.
 */
export type HandleChangeFn = {
  (event: React.ChangeEvent<any>): void;
  // Must remain the same as HandleChangeEventFn
  (name: string): HandleChangeEventFn;
};

/**
 * Formik form event handlers
 */
export interface FormHandlers {
  handleSubmit: HandleSubmitFn;
  handleReset: HandleResetFn;
  handleBlur: HandleBlurFn;
  handleChange: HandleChangeFn;
}

export type ValidateFn<Values extends FormikValues> = (
  values?: Values | undefined
) => Promise<void | FormikErrors<Values>>;

/** Internal Formik registration methods that get passed down as props */
export interface FieldRegistration<Values> {
  unregisterField: UnregisterFieldFn<Values>;
  registerField: RegisterFieldFn<Values>;
}

export interface FormFieldHelpers<Values> {
  TypedField: TypedField<Values>;
  TypedFieldArray: TypedFieldArray<Values>;
}

export type FormApi<Values extends FormikValues> = FormHelpers<Values> &
  FormStateHelpers<Values> &
  FormHandlers &
  FieldRegistration<Values> &
  FormFieldHelpers<Values>;

export type FormValidator<Values extends FormikValues> = (
  values: Values
) => void | FormikErrors<Values> | Promise<FormikErrors<Values> | void>;

export interface FormikValidationConfig<Values> {
  /** Tells Formik to validate the form on each input's onChange event */
  validateOnChange?: boolean;
  /** Tells Formik to validate the form on each input's onBlur event */
  validateOnBlur?: boolean;
  /** Tells Formik to validate upon mount */
  validateOnMount?: boolean;
  /**
   * A Yup Schema or a function that returns a Yup schema
   */
  validationSchema?: any | (() => any);
  /**
   * Validation function. Must return an error object or promise that
   * throws an error object where that object keys map to corresponding value.
   */
  validate?: FormValidator<Values>;
}

export interface FormInitialConfig<Values> {
  /**
   * Initial values of the form
   */
  initialValues: Values;

  /**
   * Initial status
   */
  initialStatus?: any;

  /** Initial object map of field names to specific error for that field */
  initialErrors?: FormikErrors<Values>;

  /** Initial object map of field names to whether the field has been touched */
  initialTouched?: FormikTouched<Values>;
}

export interface FormEventConfig<Values> {
  /**
   * Reset handler
   */
  onReset?: FormikResetHandler<Values>;

  /**
   * Submission handler
   */
  onSubmit: FormikSubmitHandler<Values>;
}

/**
 * Base formik configuration/props shared between the HoC and Component.
 */
export interface FormSharedConfig<Values = any>
  extends FormikValidationConfig<Values> {
  /** Should Formik reset the form when new initialValues change */
  enableReinitialize?: boolean;
}

export type FormikResetHandler<Values> = (
  values: Values,
  formikHelpers: FormHelpers<Values>
) => void | Promise<any>;

export type FormikSubmitHandler<Values> = (
  values: Values,
  formikHelpers: FormHelpers<Values>
) => void | Promise<any>;

export type GenericFieldHTMLAttributes =
  | JSX.IntrinsicElements['input']
  | JSX.IntrinsicElements['select']
  | JSX.IntrinsicElements['textarea'];

/**
 * @deprecated use `SetFieldTouchedFn`
 */
export type SetFieldTouched<Values> = SetFieldTouchedFn<Values>;

export type FieldOnChangeProp<Value> = (
  eventOrValue: React.ChangeEvent<any> | Value
) => void;
export type FieldOnBlurProp = (
  eventOrValue: React.ChangeEvent<any> | any
) => void;

/** Field input value, name, and event handlers */
export type FieldInputProps<Value, Values> = {
  /** Value of the field */
  value: SingleValue<Value>;
  /** Name of the field */
  name: PathMatchingValue<Value, Values>;
  /** Multiple select? */
  multiple?: boolean;
  /** Is the field checked? */
  checked?: boolean;
  /** Change event handler */
  onChange: FieldOnChangeProp<Value>;
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
};

export type FieldValidationResult = string | void | Promise<string | void>;

export type FieldValidator<Value> = (
  value: Value
) => FieldValidationResult | Promise<FieldValidationResult>;

// This is an object that contains a map of all registered fields
// and their validate functions
export interface FieldRegistry {
  [field: string]: {
    validate?: FieldValidator<any>;
  };
}

/**
 * If an object has optional properties, force passing undefined.
 * This helps us make sure we are passing back all possible props.
 */
export type NotOptional<T> = {
  [Key in keyof Required<T>]: T[Key] extends Required<T[Key]>
    ? T[Key]
    : T[Key] | undefined;
};
