import * as React from 'react';

import { connect } from './connect';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FormikContext,
} from './types';
import warning from 'tiny-warning';
import { getIn, isEmptyChildren, isFunction } from './utils';

/**
 * FastFieldProps are the props accessible from:
 * <FastField render={(FastFieldProps) => {}},
 * <FastField>{(FastFieldProps) => {}</Field>} and
 * <FastField component={MyComponent:
 *   typeof React.ComponentType<FastFieldProps>} />
 */
export type FastFieldProps<Values = any, Key extends keyof Values = any> = {
  field: {
    /** Classic React change handler, keyed by input name */
    onChange: (e: React.ChangeEvent<any>) => void;
    /** Mark input as touched */
    onBlur: (e: any) => void;
    /** Value of the input */
    value: Values[Key];
    /* name of the input */
    name: Key;
  };
  formik: FormikProps<Values>; // if ppl want to restrict this for a given form, let them.
} & GenericFieldHTMLAttributes;

export type FastFieldAttributes<
  Values = any,
  Key extends keyof Values = any
> = FastFieldConfig<Values, Key> & GenericFieldHTMLAttributes;

type FastFieldInnerProps<
  Values,
  Key extends keyof Values = any
> = FastFieldAttributes<Values, Key> & {
  formik: FormikContext<Values>;
};

export interface FastFieldConfig<Values = any, Key extends keyof Values = any> {
  /**
   * Field component to render. Can either be a string like 'select' or a component.
   */
  component?:
    | string
    | React.ComponentType<FastFieldProps<Values, Key>>
    | React.ComponentType<void>;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   */
  render?: ((props: FastFieldProps<Values, Key>) => React.ReactNode);

  /**
   * Children render function <Field name>{props => ...}</Field>)
   */
  children?:
    | ((props: FastFieldProps<Values, Key>) => React.ReactNode)
    | React.ReactNode;

  /**
   * Validate a single field value independently
   */
  validate?: ((value: Values[Key]) => string | Promise<void> | undefined);

  /** Override FastField's default shouldComponentUpdate */
  shouldUpdate?: (
    nextProps: FastFieldInnerProps<Values, Key>,
    props: {}
  ) => boolean;

  /**
   * Field name
   */
  name: Key;

  /** HTML class */
  className?: string;

  /** HTML input type */
  type?: string;

  /** Field value */
  value?: Values[Key];

  /** Inner ref */
  innerRef?: (instance: any) => void;
}

/**
 * Custom Field component for quickly hooking into Formik
 * context and wiring up forms.
 */
class FastFieldInner<
  Values = {},
  Key extends keyof Values = any
> extends React.Component<FastFieldInnerProps<Values, Key>, {}> {
  constructor(props: FastFieldInnerProps<Values, Key>) {
    super(props);
    const { render, children, component } = props;
    warning(
      !(component && render),
      'You should not use <FastField component> and <FastField render> in the same <FastField> component; <FastField component> will be ignored'
    );

    warning(
      !(component && children && isFunction(children)),
      'You should not use <FastField component> and <FastField children> as a function in the same <FastField> component; <FastField component> will be ignored.'
    );

    warning(
      !(render && children && !isEmptyChildren(children)),
      'You should not use <FastField render> and <FastField children> in the same <FastField> component; <FastField children> will be ignored'
    );
  }

  shouldComponentUpdate(props: FastFieldInnerProps<Values, Key>) {
    if (this.props.shouldUpdate) {
      return this.props.shouldUpdate(props, this.props);
    } else if (
      getIn(this.props.formik.values, this.props.name) !==
        getIn(props.formik.values, this.props.name) ||
      getIn(this.props.formik.errors, this.props.name) !==
        getIn(props.formik.errors, this.props.name) ||
      getIn(this.props.formik.touched, this.props.name) !==
        getIn(props.formik.touched, this.props.name) ||
      Object.keys(this.props).length !== Object.keys(props).length ||
      this.props.formik.isSubmitting !== props.formik.isSubmitting
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    // Register the Field with the parent Formik. Parent will cycle through
    // registered Field's validate fns right prior to submit
    this.props.formik.registerField(this.props.name, this);
  }

  componentDidUpdate(prevProps: FastFieldInnerProps<Values, Key>) {
    if (this.props.name !== prevProps.name) {
      this.props.formik.unregisterField(prevProps.name);
      this.props.formik.registerField(this.props.name, this);
    }

    if (this.props.validate !== prevProps.validate) {
      this.props.formik.registerField(this.props.name, this);
    }
  }

  componentWillUnmount() {
    this.props.formik.unregisterField(this.props.name);
  }

  render() {
    const {
      validate,
      name,
      render,
      children,
      component = 'input',
      formik,
      shouldUpdate,
      ...props
    } = this.props;
    const {
      validate: _validate,
      validationSchema: _validationSchema,
      ...restOfFormik
    } = formik;
    const field = {
      value:
        props.type === 'radio' || props.type === 'checkbox'
          ? props.value // React uses checked={} for these inputs
          : getIn(formik.values, name),
      name,
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
    };
    const bag = { field, formik: restOfFormik };

    if (render) {
      return render(bag);
    }

    if (isFunction(children)) {
      return children(bag);
    }

    if (typeof component === 'string') {
      const { innerRef, ...rest } = props;
      return React.createElement(component as any, {
        ref: innerRef,
        ...field,
        ...rest,
        children,
      });
    }

    return React.createElement(component as any, {
      ...bag,
      ...props,
      children,
    });
  }
}

export const FastField = connect<FastFieldAttributes<any>, any>(FastFieldInner);
