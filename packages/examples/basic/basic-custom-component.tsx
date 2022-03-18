import * as React from 'react';
import { Formik, FormikProps } from 'formik';
import { exampleOnSubmit, ExampleFormValues, exampleInitialValues } from '../helpers/basic-helpers';

const CustomFormikComponent = (props: FormikProps<ExampleFormValues>) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.firstName}
          name="firstName"
          id="firstName"
        />
        {props.errors.firstName && props.touched.firstName && (
          <div id="feedback">{props.errors.firstName}</div>
        )}
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.lastName}
          name="lastName"
          id="lastName"
        />
        {props.errors.lastName && props.touched.lastName && (
          <div id="feedback">{props.errors.lastName}</div>
        )}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values.email}
          placeholder="john@example.com"
          name="email"
          id="email"
        />
        {props.errors.email && props.touched.email && (
          <div id="feedback">{props.errors.email}</div>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const BasicExampleWithCustomComponent = () => {
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={exampleInitialValues}
        onSubmit={exampleOnSubmit}
        component={CustomFormikComponent}
      />
    </div>
  );
};

export default BasicExampleWithCustomComponent;
