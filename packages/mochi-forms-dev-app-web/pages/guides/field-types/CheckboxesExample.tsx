import React from 'react';
import { Formik, LegacyField, Form } from '@mochi-forms/react';
import { sleep } from '../../../helpers/example-helpers';

const CheckboxesExample = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={{
        toggle: false,
        checked: [],
      }}
      onSubmit={async values => {
        await sleep(500);
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          {/*
            This first checkbox will result in a boolean value being stored. Note that the `value` prop
            on the <Field/> is omitted
          */}
          <label>
            <LegacyField type="checkbox" name="toggle" />
            {`${values.toggle}`}
          </label>

          {/*
            Multiple checkboxes with the same name attribute, but different
            value attributes will be considered a "checkbox group". Formik will automagically
            bind the checked values to a single array for your benefit. All the add and remove
            logic will be taken care of for you.
          */}
          <div id="checkbox-group">Checked</div>
          <div role="group" aria-labelledby="checkbox-group">
            <label>
              <LegacyField type="checkbox" name="checked" value="One" />
              One
            </label>
            <label>
              <LegacyField type="checkbox" name="checked" value="Two" />
              Two
            </label>
            <label>
              <LegacyField type="checkbox" name="checked" value="Three" />
              Three
            </label>
          </div>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  </div>
);

export default CheckboxesExample;
