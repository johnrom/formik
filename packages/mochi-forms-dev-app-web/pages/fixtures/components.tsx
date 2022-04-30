import * as React from 'react';
import {
  Formik,
  LegacyField,
  Form,
  FieldComponentProps,
  FieldAsProps,
  FieldRenderProps,
} from '@mochi-forms/react';
import { DebugProps } from '../../components/debugging/DebugProps';

const initialValues = {
  name: '',
};

const RenderComponent = (
  props: FieldRenderProps<string, typeof initialValues>
) => (
  <>
    <input data-testid="child" {...props.field} />
    <DebugProps {...props} />
  </>
);
const ComponentComponent = (
  props: FieldComponentProps<string, typeof initialValues>
) => (
  <>
    <input data-testid="child" {...props.field} />
    <DebugProps {...props} />
  </>
);
const AsComponent = (props: FieldAsProps<string, typeof initialValues>) => (
  <>
    <input data-testid="child" {...props} />
    <DebugProps {...props} />
  </>
);

const ComponentsPage = () => (
  <div>
    <h1>Test Components</h1>
    <Formik
      initialValues={initialValues}
      validate={values => {
        console.log(values);
      }}
      onSubmit={async values => {
        await new Promise(r => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <LegacyField name="name">{RenderComponent}</LegacyField>
        <LegacyField name="name" render={RenderComponent} />
        <LegacyField name="name" component={ComponentComponent} />
        <LegacyField name="name" as={AsComponent} />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  </div>
);

export default ComponentsPage;
