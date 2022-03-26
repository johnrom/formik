import type { ComponentType, SFC, ReactNode, ComponentClass } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

import type { FormikContextType } from './types';
import { FormikConsumer } from './FormikContext';

/**
 * Connect any component to Formik context, and inject as a prop called `formik`;
 * @param Comp React Component
 */
export function connect<OuterProps, Values = {}>(
  Comp: ComponentType<OuterProps & { formik: FormikContextType<Values> }>
) {
  const C: SFC<OuterProps> = (props: OuterProps) => (
    <FormikConsumer>
      {formik => {
        invariant(
          !!formik,
          `Formik context is undefined, please verify you are rendering <Form>, <Field>, <FastField>, <FieldArray>, or your custom context-using component as a child of a <Formik> component. Component name: ${Comp.name}`
        );
        return <Comp {...props} formik={formik} />;
      }}
    </FormikConsumer>
  );
  const componentDisplayName =
    Comp.displayName ||
    Comp.name ||
    (Comp.constructor && Comp.constructor.name) ||
    'Component';

  // Assign Comp to C.WrappedComponent so we can access the inner component in tests
  // For example, <Field.WrappedComponent /> gets us <FieldInner/>
  (C as SFC<OuterProps> & {
    WrappedComponent: ReactNode;
  }).WrappedComponent = Comp;

  C.displayName = `FormikConnect(${componentDisplayName})`;

  return hoistNonReactStatics(
    C,
    Comp as ComponentClass<
      OuterProps & { formik: FormikContextType<Values> }
    > // cast type to ComponentClass (even if SFC)
  ) as ComponentType<OuterProps>;
}
