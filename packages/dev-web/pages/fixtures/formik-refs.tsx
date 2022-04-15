import * as React from 'react';
import { Formik, Field, FormikProps, useFormikSubscriptionByRef } from '@johnrom/formik-v3';
import { DebugProps } from '../../components/debugging/DebugProps';

const initialValues = {
  name: '',
};

const FormWithRef = React.forwardRef<FormikProps<typeof initialValues>, React.PropsWithChildren<{}>>(({ children }, ref) => {
  return <Formik innerRef={ref as any} initialValues={initialValues} onSubmit={(values) => console.log(values)}>{children}</Formik>
});

const ComponentsPage = () => {
  const formikRef = React.useRef<FormikProps<typeof initialValues> | null>(null);
  const values = useFormikSubscriptionByRef(formikRef, initialValues, React.useCallback(s => s.values, []));

  return (
    <div>
      <h1>Test Components</h1>
      <FormWithRef ref={formikRef}>
        <Field name="name" />
      </FormWithRef>
      <DebugProps {...values} />
    </div>
  );
};

export default ComponentsPage;
