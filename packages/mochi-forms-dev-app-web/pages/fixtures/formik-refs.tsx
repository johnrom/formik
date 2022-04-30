import * as React from 'react';
import {
  Formik,
  LegacyField,
  FormikProps,
  useFormikSubscriptionByRef,
} from '@mochi-forms/react';
import { DebugProps } from '../../components/debugging/DebugProps';

const initialValues = {
  name: '',
};

interface FormProps {}

const FormWithRef = React.forwardRef<
  FormikProps<typeof initialValues>,
  React.PropsWithChildren<FormProps>
>(({ children }, ref) => {
  return (
    <Formik
      innerRef={ref as any}
      initialValues={initialValues}
      onSubmit={values => console.log(values)}
    >
      {children}
    </Formik>
  );
});

FormWithRef.displayName = 'FormWithRef';

const ComponentsPage = () => {
  const formikRef = React.useRef<FormikProps<typeof initialValues> | null>(
    null
  );
  const values = useFormikSubscriptionByRef(
    formikRef,
    initialValues,
    React.useCallback(s => s.values, [])
  );

  return (
    <div>
      <h1>Test Components</h1>
      <FormWithRef ref={formikRef}>
        <LegacyField name="name" />
      </FormWithRef>
      <DebugProps {...values} />
    </div>
  );
};

export default ComponentsPage;
