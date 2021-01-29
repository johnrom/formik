import * as React from 'react';
import { Formik, Form, useField, FieldConfig } from 'formik';
import { Collapse } from '../components/debugging/Collapse';
import { useIsomorphicLayoutEffect } from '@formik/core';
import { selectRange } from '../helpers/array-helpers';

const Input = (p: FieldConfig<string>) => {
  const [field, meta] = useField(p);
  const renders = React.useRef(0);
  const committedRenders = React.useRef(0);
  useIsomorphicLayoutEffect(() => {
    committedRenders.current++;
  });
  return (
    <>
      <label>{p.name} </label>
      <input {...field} />
      <div>
        {renders.current++}, {committedRenders.current}
      </div>
      {meta.touched && meta.error ? <div>{meta.error.toString()}</div> : null}
      <small>
        <pre>{JSON.stringify(meta, null, 2)}</pre>
      </small>
    </>
  );
};

const isRequired = (v: string) => {
  return v && v.trim() !== '' ? undefined : 'Required';
};

const fieldsArray = selectRange(500);
const initialValues = fieldsArray.reduce<Record<string, string>>((prev, id) => {
  prev[`Input ${id}`] = '';

  return prev;
}, {});

const onSubmit = async (values: typeof initialValues) => {
  await new Promise(r => setTimeout(r, 500));
  alert(JSON.stringify(values, null, 2));
};

export function Perf500SamePage() {
  return (
    <div>
      <div>
        <h1>Formik v3 with 500 controlled fields</h1>
        <div>
          <span>#, #</span> = number of renders, number of committed renders
        </div>
      </div>
      <Formik onSubmit={onSubmit} initialValues={initialValues}>
        <Form>
          <Input name={'Input'} validate={isRequired} />
          <Collapse>
            {fieldsArray.map(id => (
              <Input key={`input-${id}`} name={'Input'} validate={isRequired} />
            ))}
          </Collapse>
          <Input name={'Input'} validate={isRequired} />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
