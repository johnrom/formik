import React from 'react';
import { Formik } from 'formik';
import { exampleOnSubmit, exampleInitialValues } from '../helpers/basic-helpers';

const BasicExampleWithFunctionAsChildren = () => (
  <div>
    <h1>My Form</h1>
    <Formik initialValues={exampleInitialValues} onSubmit={exampleOnSubmit}>
      {props => (
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
      )}
    </Formik>
  </div>
);

export default BasicExampleWithFunctionAsChildren;
