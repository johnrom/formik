import React from 'react';
import {
  FormikErrors,
  FormHelpers,
  FormikTouched,
  FormikValues,
} from '../types';
import { isFunction } from '../utils';
import { FormikBag, FormikProps, FormikSharedConfig } from './legacy-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Formik } from './Formik';

/**
 * withFormik() configuration options. Backwards compatible.
 */
export interface WithFormikConfig<
  Props,
  Values extends FormikValues = FormikValues,
  DeprecatedPayload = Values
> extends Omit<FormikSharedConfig<Props>, 'validate'> {
  /**
   * Set the display name of the component. Useful for React DevTools.
   */
  displayName?: string;

  /**
   * Submission handler
   */
  handleSubmit: (values: Values, formikBag: FormikBag<Props, Values>) => void;

  /**
   * Map props to the form values
   */
  mapPropsToValues?: (props: Props) => Values;

  /**
   * Map props to the form status
   */
  mapPropsToStatus?: (props: Props) => any;

  /**
   * Map props to the form touched state
   */
  mapPropsToTouched?: (props: Props) => FormikTouched<Values>;

  /**
   * Map props to the form errors state
   */
  mapPropsToErrors?: (props: Props) => FormikErrors<Values>;

  /**
   * @deprecated in 0.9.0 (but needed to break TS types)
   */
  mapValuesToPayload?: (values: Values) => DeprecatedPayload;

  /**
   * A Yup Schema or a function that returns a Yup schema
   */
  validationSchema?: any | ((props: Props) => any);

  /**
   * Validation function. Must return an error object or promise that
   * throws an error object where that object keys map to corresponding value.
   */
  validate?: (values: Values, props: Props) => void | object | Promise<any>;
}

export type CompositeComponent<P> =
  | React.ComponentClass<P>
  | React.StatelessComponent<P>;

export interface ComponentDecorator<TOwnProps, TMergedProps> {
  (component: CompositeComponent<TMergedProps>): React.ComponentType<TOwnProps>;
}

/**
 * A public higher-order component to access the imperative API
 */
export function withFormik<
  OuterProps extends object,
  Values extends FormikValues,
  Payload = Values
>({
  mapPropsToValues = (vanillaProps: OuterProps): Values => {
    const val = {} as Values;
    for (const k in vanillaProps) {
      if (
        // eslint-disable-next-line no-prototype-builtins
        vanillaProps.hasOwnProperty(k) &&
        typeof vanillaProps[k] !== 'function'
      ) {
        // @todo TypeScript fix
        (val as any)[k] = vanillaProps[k];
      }
    }
    return val as Values;
  },
  ...config
}: WithFormikConfig<OuterProps, Values, Payload>): ComponentDecorator<
  OuterProps,
  OuterProps & FormikProps<Values>
> {
  return function createFormik(
    Component: CompositeComponent<OuterProps & FormikProps<Values>>
  ): React.ComponentClass<OuterProps> {
    const componentDisplayName =
      Component.displayName ||
      Component.name ||
      (Component.constructor && Component.constructor.name) ||
      'Component';
    /**
     * We need to use closures here for to provide the wrapped component's props to
     * the respective withFormik config methods.
     */
    class C extends React.Component<OuterProps, {}> {
      static displayName = `WithFormik(${componentDisplayName})`;

      validate = (values: Values): void | object | Promise<any> => {
        return config.validate?.(values, this.props);
      };

      validationSchema = () => {
        return isFunction(config.validationSchema)
          ? config.validationSchema?.(this.props)
          : config.validationSchema;
      };

      handleSubmit = (values: Values, actions: FormHelpers<Values>) => {
        return config.handleSubmit(values, {
          ...actions,
          props: this.props,
        });
      };

      /**
       * Just avoiding a render callback for perf here
       */
      renderFormComponent = (formikProps: FormikProps<Values>) => {
        return <Component {...this.props} {...formikProps} />;
      };

      render() {
        const { children, ...props } = this.props as any;
        return (
          <Formik
            {...props}
            {...config}
            validate={config.validate && this.validate}
            validationSchema={config.validationSchema && this.validationSchema}
            initialValues={mapPropsToValues(this.props)}
            initialStatus={
              config.mapPropsToStatus && config.mapPropsToStatus(this.props)
            }
            initialErrors={
              config.mapPropsToErrors && config.mapPropsToErrors(this.props)
            }
            initialTouched={
              config.mapPropsToTouched && config.mapPropsToTouched(this.props)
            }
            onSubmit={this.handleSubmit as any}
            children={this.renderFormComponent}
          />
        );
      }
    }

    return hoistNonReactStatics(
      C,
      Component as React.ComponentClass<OuterProps & FormikProps<Values>> // cast type to ComponentClass (even if SFC)
    ) as React.ComponentClass<OuterProps>;
  };
}
