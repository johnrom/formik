import { MutableRefObject } from 'react';
import {
  SetStatusFn,
  SetErrorsFn,
  SetSubmittingFn,
  SetTouchedFn,
  SetValuesFn,
  SetFieldValueFn,
  SetFieldErrorFn,
  SetFieldTouchedFn,
  IsFormValidFn,
  ValidateFieldFn,
  ResetFormFn,
  SubmitFormFn,
  SetFormikStateFn,
  GetFieldHelpersFn,
  HandleResetFn,
  HandleBlurFn,
  HandleChangeFn,
  HandleSubmitFn,
  GetValueFromEventFn,
  ValidateFormFn,
} from './selectors';

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
export interface FormikState<Values> {
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

type MakeRefs<T extends object> = {
  [key in keyof T]: MutableRefObject<T[key]>;
};

export type FormikRefs<Values> = MakeRefs<FormikInitialState<Values>> & {
  isMounted: MutableRefObject<boolean>;
};

export type FormikMessage<
  Values,
  State extends FormikState<Values> = FormikState<Values>
> =
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'SUBMIT_FAILURE' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SET_ISVALIDATING'; payload: boolean }
  | { type: 'SET_ISSUBMITTING'; payload: boolean }
  | { type: 'SET_VALUES'; payload: Values }
  | { type: 'RESET_VALUES'; payload: Values }
  | { type: 'SET_FIELD_VALUE'; payload: { field: string; value?: any } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { field: string; value?: boolean } }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; value?: string } }
  | { type: 'SET_TOUCHED'; payload: FormikTouched<Values> }
  | { type: 'RESET_TOUCHED'; payload: FormikTouched<Values> }
  | { type: 'SET_ERRORS'; payload: FormikErrors<Values> }
  | { type: 'RESET_ERRORS'; payload: FormikErrors<Values> }
  | { type: 'SET_STATUS'; payload: any }
  | { type: 'RESET_STATUS'; payload: any }
  | {
      type: 'SET_FORMIK_STATE';
      payload: (s: State) => State;
    }
  | {
      type: 'RESET_FORM';
      payload: State;
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

export type GetStateFn<
  Values,
  State extends FormikState<Values> = FormikState<Values>
> = () => State;
export type UnregisterFieldFn = (name: string) => void;
export type RegisterFieldFn = (name: string, { validate }: any) => void;

/**
 * Formik state helpers
 */
export interface FormikHelpers<
  Values,
  State extends FormikState<Values> = FormikState<Values>
> {
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
  setFieldError: SetFieldErrorFn;
  /** Set whether field has been touched directly */
  setFieldTouched: SetFieldTouchedFn<Values>;
  /** Detect whether a form is valid based on isInitialValid, errors and dirty */
  isFormValid: IsFormValidFn<Values>;
  /** Validate form values */
  validateForm: ValidateFormFn<Values>;
  /** Validate field value */
  validateField: ValidateFieldFn;
  /** Reset form */
  resetForm: ResetFormFn<Values, State>;
  /** Submit the form imperatively */
  submitForm: SubmitFormFn;
  /** Set Formik state, careful! */
  setFormikState: SetFormikStateFn<Values>;
}

export interface FieldHelpers {
  getValueFromEvent: GetValueFromEventFn;
  getFieldProps: <Value = any>(props: any) => FieldInputProps<Value>;
  getFieldMeta: <Value>(name: string) => FieldMetaProps<Value>;
  getFieldHelpers: GetFieldHelpersFn;
}

/**
 * Formik form event handlers
 */
export interface FormikHandlers {
  handleSubmit: HandleSubmitFn;
  handleReset: HandleResetFn;
  handleBlur: HandleBlurFn;
  handleChange: HandleChangeFn;
}
export type FormikCoreApi<Values extends FormikValues> = FormikHelpers<
  Values,
  FormikState<Values>
> &
  FieldHelpers &
  FormikHandlers & {
    unregisterField: UnregisterFieldFn;
    registerField: RegisterFieldFn;
  };

export interface FormikValidationConfig {
  /** Tells Formik to validate the form on each input's onChange event */
  validateOnChange?: boolean;
  /** Tells Formik to validate the form on each input's onBlur event */
  validateOnBlur?: boolean;
  /** Tells Formik to validate upon mount */
  validateOnMount?: boolean;
}

/**
 * Base formik configuration/props shared between the HoC and Component.
 */
export type FormikSharedConfig<Props = {}> = FormikValidationConfig & {
  /** Tell Formik if initial form values are valid or not on first render */
  isInitialValid?: boolean | ((props: Props) => boolean);
  /** Should Formik reset the form when new initialValues change */
  enableReinitialize?: boolean;
};

export type ValidateFn<Values extends FormikValues> = (
  values?: Values | undefined
) => Promise<void | FormikErrors<Values>>;

/**
 * <Formik /> props
 */
export interface FormikConfig<
  Values,
  State extends FormikState<Values> = FormikState<Values>
> extends FormikSharedConfig {
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
    formikHelpers: FormikHelpers<Values, State>
  ) => void | Promise<any>;

  /**
   * Submission handler
   */
  onSubmit: (
    values: Values,
    formikHelpers: FormikHelpers<Values, State>
  ) => void | Promise<any>;
  /**
   * A Yup Schema or a function that returns a Yup schema
   */
  validationSchema?: any | (() => any);

  /**
   * Validation function. Must return an error object or promise that
   * throws an error object where that object keys map to corresponding value.
   */
  validate?: (values: Values) => void | object | ValidateFn<Values>;

  /** Inner ref */
  innerRef?: React.Ref<FormikCoreApi<Values>>;
}

/**
 * State, handlers, and helpers made available to form component or render prop
 * of <Formik/>.
 */
export type FormikProps<Values> = FormikSharedConfig &
  FormikInitialState<Values> &
  FormikHelpers<Values> &
  FieldHelpers &
  FormikHandlers &
  FormikComputedState &
  FormikRegistration;

/** Internal Formik registration methods that get passed down as props */
export interface FormikRegistration {
  registerField: (name: string, fns: { validate?: FieldValidator }) => void;
  unregisterField: (name: string) => void;
}

/**
 * State, handlers, and helpers made available to Formik's primitive components through context.
 */
export type FormikContextType<Values> = FormikProps<Values> &
  Pick<FormikConfig<Values>, 'validate' | 'validationSchema'>;
export type FormikContextWithState<Values> = FormikContextType<Values> &
  FormikState<Values>;

export interface SharedRenderProps<T> {
  /**
   * Field component to render. Can either be a string like 'select' or a component.
   */
  component?: string | React.ComponentType<T | void>;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   */
  render?: (props: T) => React.ReactNode;

  /**
   * Children render function <Field name>{props => ...}</Field>)
   */
  children?: (props: T) => React.ReactNode;
}

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

export type FieldOnChangeProp = (
  eventOrValue: React.ChangeEvent<any> | any
) => void;
export type FieldOnBlurProp = (
  eventOrValue: React.ChangeEvent<any> | any
) => void;

/** Field input value, name, and event handlers */
export interface FieldInputProps<Value> {
  /** Value of the field */
  value: Value;
  /** Name of the field */
  name: string;
  /** Multiple select? */
  multiple?: boolean;
  /** Is the field checked? */
  checked?: boolean;
  /** Change event handler */
  onChange: FieldOnChangeProp;
  /** Blur event handler */
  onBlur: FieldOnBlurProp;
}

export type FieldValidator = (
  value: any
) => string | void | Promise<string | void>;

// This is an object that contains a map of all registered fields
// and their validate functions
export interface FieldRegistry {
  [field: string]: {
    validate: (value: any) => string | Promise<string> | undefined;
  };
}

export type ValidationHandler<Values extends FormikValues> = (
  values: Values,
  field?: string
) => Promise<FormikErrors<Values>>;
