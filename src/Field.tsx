import * as React from 'react';

import { connect } from './connect';
import {
  FormikProps,
  GenericFieldHTMLAttributes,
  FormikContext,
  FormikHandlers,
} from './types';
import warning from 'tiny-warning';
import { getIn, isEmptyChildren, isFunction } from './utils';

/**
 * Note: These typings could be more restrictive, but then it would limit the
 * reusability of custom <Field/> components.
 *
 * @example
 * interface MyProps {
 *   ...
 * }
 *
 * export const MyInput: React.SFC<MyProps & FieldConnectedProps> = ({
 *   field,
 *   formik,
 *   ...props
 * }) =>
 *   <div>
 *     <input {...field} {...props} />
 *     {formik.touched[field.name] && formik.errors[field.name]}
 *   </div>
 */

/**
 * FieldProps are the props accessible from:
 * <Field render={(FieldProps) => {}},
 * <Field>{(FieldProps) => {}</Field>} and
 * <Field component={MyComponent = typeof React.ComponentType<FieldProps>} />
 */
export type FieldProps<Values = any, Key extends keyof Values = any> = {
  field: {
    /** Classic React change handler, keyed by input name */
    onChange: FormikHandlers['handleChange'];
    /** Mark input as touched */
    onBlur: FormikHandlers['handleBlur'];
    /** Value of the input */
    value: Values[Key];
    /* name of the input */
    name: Key;
  };
  formik: FormikProps<Values>; // if ppl want to restrict this for a given form, let them.
} & GenericFieldHTMLAttributes;

/**
 * FieldAttributes are the attributes accessible via <Field attributeOne={} attributeTwo={} />
 */
export type FieldAttributes<
  Values,
  Key extends keyof Values = any
> = FieldConfig<Values, Key> & GenericFieldHTMLAttributes;

type FieldInnerProps<Values, Key extends keyof Values = any> = FieldAttributes<
  Values,
  Key
> & {
  formik: FormikContext<Values>;
};

export interface FieldConfig<Values = any, Key extends keyof Values = any> {
  /**
   * Field component to render. Can either be a string like 'select' or a component.
   */
  component?:
    | string
    | React.ComponentType<FieldProps<Values, Key>>
    | React.ComponentType<void>;

  /**
   * Render prop (works like React router's <Route render={props =>} />)
   */
  render?: ((props: FieldProps<Values, Key>) => React.ReactNode);

  /**
   * Children render function <Field name>{props => ...}</Field>)
   */
  children?:
    | ((props: FieldProps<Values, Key>) => React.ReactNode)
    | React.ReactNode;

  /**
   * Validate a single field value independently
   */
  validate?: ((value: Values[Key]) => string | Promise<void> | undefined);

  /**
   * Field name
   */
  name: Key;

  /** HTML input type */
  type?: string;

  /** Field value */
  value?: Values[Key];

  /** Inner ref */
  innerRef?: (instance: any) => void;
}

export type TypedField<Values, Key extends keyof Values> = React.ComponentType<
  FieldAttributes<Values, Key>
>;
export type TypedFieldList<Values> = {
  [fieldName in keyof Values]: TypedField<Values, fieldName>
};

/**
 * Custom Field component for quickly hooking into Formik
 * context and wiring up forms.
 */
class FieldInner<
  Values = {},
  Key extends keyof Values = any
> extends React.Component<FieldInnerProps<Values, Key>, {}> {
  constructor(props: FieldInnerProps<Values, Key>) {
    super(props);
    const { render, children, component } = props;
    warning(
      !(component && render),
      'You should not use <Field component> and <Field render> in the same <Field> component; <Field component> will be ignored'
    );

    warning(
      !(component && children && isFunction(children)),
      'You should not use <Field component> and <Field children> as a function in the same <Field> component; <Field component> will be ignored.'
    );

    warning(
      !(render && children && !isEmptyChildren(children)),
      'You should not use <Field render> and <Field children> in the same <Field> component; <Field children> will be ignored'
    );
  }

  componentDidMount() {
    // Register the Field with the parent Formik. Parent will cycle through
    // registered Field's validate fns right prior to submit
    this.props.formik.registerField(this.props.name, this);
  }

  componentDidUpdate(prevProps: FieldInnerProps<Values, Key>) {
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

export const Field = connect<FieldAttributes<any>, any>(FieldInner);

export const typedFieldProxy = <TValues extends any>() =>
  new Proxy({} as TypedFieldList<TValues>, {
    get: () => Field,
  });
