import * as React from 'react';
import { Comparer, Selector } from 'use-optimized-selector';
import { TypedField } from './Field.types';
import { TypedFieldArray } from './FieldArray.types';
import { PathMatchingValue, PathOf } from './helpers/path-helpers';
export { PathMatchingValue, PathOf, ValueMatchingPath } from './helpers/path-helpers';

export type ParseFn<Value> = (value: unknown, name: string) => Value;
export type FormatFn<Value> = (value: Value, name: string) => any;

export type SingleValue<Value> =
  Value extends (infer SingleValue)[]
    ? SingleValue
    : Value;

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

export interface FormikInitialState<Values> {
  initialValues: FormikConfig<Values>['initialValues'];
  initialErrors: FormikConfig<Values>['initialErrors'];
  initialTouched: FormikConfig<Values>['initialTouched'];
  initialStatus: FormikConfig<Values>['initialStatus'];
}

export type FormikReducerState<Values> = FormikInitialState<Values> &
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
    payload: (s: FormikReducerState<Values>) => FormikReducerState<Values>;
  }
| {
    type: 'RESET_FORM';
    payload: Partial<FormikReducerState<Values>>;
  };

/**
 * Formik computed state. These are read-only and
 * result from updates to FormikState but do not live there.
 */
export interface FormikComputedState {
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

/**
 * @deprecated use FormikComputedState
 */
export type FormikComputedProps = FormikComputedState;

export type FormikState<Values> = FormikReducerState<Values> &
  FormikComputedState;

export type GetStateFn<Values> = () => FormikState<Values>;

export type RegisterFieldFn<Values> = <Value,>(
  name: PathMatchingValue<Value, Values>,
  args: { validate?: FieldValidator<SingleValue<Value>> },
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

export type SetFieldValueFn<Values extends FormikValues> = <
  Value
>(
  field: PathMatchingValue<Value, Values>,
  value: Value,
  shouldValidate?: boolean | undefined
) => Promise<void | FormikErrors<Values>>;

export type SetFieldErrorFn<Values> = <Path extends PathOf<Values>>(
  field: Path,
  error: string | undefined
) => void;

export type SetFieldTouchedFn<Values extends FormikValues> = <Path extends PathOf<Values>>(
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
  nextState?: Partial<FormikReducerState<Values>> | undefined
) => void;

export type SetFormikStateFn<Values extends FormikValues> = (
  stateOrCb:
    | FormikReducerState<Values>
    | ((state: FormikReducerState<Values>) => FormikReducerState<Values>)
) => void;

export type SubmitFormFn = () => Promise<any>;

export interface FormikHelpers<Values> {
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

export interface FormikStateHelpers<Values> {
  /** Get Formik State from outside of Render. */
  getState: GetStateFn<Values>;
  /** Use Formik State from within Render. */
  useState: <Return>(
    selector: Selector<FormikState<Values>, Return>,
    comparer?: Comparer<Return>,
    shouldSubscribe?: boolean
  ) => Return;
}

export type GetValueFromEventFn = (
  event: React.SyntheticEvent<any>,
  fieldName: string
) => any;

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
export type HandleChangeEventFn = (event: React.ChangeEvent<any>) => void;

/**
 * Type of `formik.handleChange`.
 * May be an event callback, or accept a field name and return an event callback.
 */
export type HandleChangeFn = {
  (eventOrPath: React.ChangeEvent<any>): void;
  // Must remain the same as HandleChangeEventFn
  (event: string): HandleChangeEventFn;
};

/**
 * Formik form event handlers
 */
export interface FormikHandlers {
  handleSubmit: HandleSubmitFn;
  handleReset: HandleResetFn;
  handleBlur: HandleBlurFn;
  handleChange: HandleChangeFn;
}

export type ValidateFn<Values extends FormikValues> = (
  values?: Values | undefined
) => Promise<void | FormikErrors<Values>>;

/** Internal Formik registration methods that get passed down as props */
export interface FormikRegistration<Values> {
  unregisterField: UnregisterFieldFn<Values>;
  registerField: RegisterFieldFn<Values>;
}

export interface FormikFieldHelpers<Values> {
  TypedField: TypedField<Values>;
  TypedFieldArray: TypedFieldArray<Values>;
}

export type FormikApi<Values extends FormikValues> = FormikHelpers<Values> &
  FormikStateHelpers<Values> &
  FormikHandlers &
  FormikRegistration<Values> &
  FormikFieldHelpers<Values> & {
    getValueFromEvent: GetValueFromEventFn;
  };

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
  validate?: (values: Values) => void | object | ValidateFn<Values>;
}

/**
 * Base formik configuration/props shared between the HoC and Component.
 */
export type FormikSharedConfig<
  Props = {},
  Values = any
> = FormikValidationConfig<Values> & {
  /** Tell Formik if initial form values are valid or not on first render */
  isInitialValid?: boolean | ((props: Props) => boolean);
  /** Should Formik reset the form when new initialValues change */
  enableReinitialize?: boolean;
};

/**
 * State, handlers, and helpers made available to form component or render prop
 * of <Formik/>.
 */
export type FormikProps<Values> = FormikSharedConfig<Values> &
  FormikReducerState<Values> &
  FormikInitialState<Values> &
  FormikHelpers<Values> &
  FormikFieldHelpers<Values> &
  FormikHandlers &
  FormikComputedState &
  FormikRegistration<Values>;

/**
 * <Formik /> props
 */
export interface FormikConfig<Values> extends FormikSharedConfig {
  /**
   * Form component to render
   */
  component?: React.ComponentType<FormikProps<Values>>;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   * @deprecated
   */
  render?: (props: FormikProps<Values>) => React.ReactNode;

  /**
   * React children or child render callback
   */
  children?:
    | ((props: FormikProps<Values>) => React.ReactNode)
    | React.ReactNode;

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

  /**
   * Reset handler
   */
  onReset?: (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => void | Promise<any>;

  /**
   * Submission handler
   */
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values>
  ) => void | Promise<any>;

  /** Inner ref */
  innerRef?: React.Ref<FormikProps<Values>>;
}


/**
 * State, handlers, and helpers made available to Formik's primitive components through context.
 */
export type FormikContextType<Values> = FormikApi<Values> &
  Pick<FormikConfig<Values>, 'validate' | 'validationSchema'>;

export type GenericFieldHTMLAttributes =
  | JSX.IntrinsicElements['input']
  | JSX.IntrinsicElements['select']
  | JSX.IntrinsicElements['textarea'];

/** Field metadata */
export interface FieldMetaProps<Value> {
  /** Value of the field */
  value: Value;
  /** Error message of the field */
  error?: string;
  /** Has the field been visited? */
  touched: boolean;
  /** Initial value of the field */
  initialValue?: Value;
  /** Initial touched state of the field */
  initialTouched: boolean;
  /** Initial error message of the field */
  initialError?: string;
}

/**
 * @deprecated use `SetFieldTouchedFn`
 */
export type SetFieldTouched<Values> = SetFieldTouchedFn<Values>;

/** Imperative handles to change a field's value, error and touched */
export interface FieldHelperProps<Value> {
  /** Set the field's value */
  setValue: (value: Value, shouldValidate?: boolean) => void;
  /** Set the field's touched value */
  setTouched: (value: boolean, shouldValidate?: boolean) => void;
  /** Set the field's error value */
  setError: (error: string) => void;
}

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

export type FieldValidator<Value> = (
  value: Value
) => string | void | Promise<string | void>;

// This is an object that contains a map of all registered fields
// and their validate functions
export interface FieldRegistry {
  [field: string]: {
    validate: FieldValidator<any>;
  };
}

export type ValidationHandler<Values extends FormikValues> = (
  values: Values,
  field?: string
) => Promise<FormikErrors<Values>>;

/**
 * The expensive type returned by connect() and deprecated FormikConsumer, includes ContextType, State and Config
 */
export type FormikConnectedType<Values> =
  FormikContextType<Values> &
  FormikSharedConfig<Values> &
  FormikState<Values>;

/**
 * If an object has optional properties, force passing undefined.
 * This helps us make sure we are passing back all possible props.
 */
export type NotOptional<T> = {
  [Key in keyof Required<T>]: T[Key] extends Required<T[Key]>
    ? T[Key]
    : T[Key] | undefined;
};
