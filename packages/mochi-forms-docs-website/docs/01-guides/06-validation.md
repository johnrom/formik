---
title: Validation
---

# Validation

todo: Validation can be configured at the form level or the field level. Additionally, custom validators can be used, like an integration with Yup.

## Configuring Validation

Validation can be configured at the field and form levels for Helper Components, Hooks, and Higher-order Components. Additionally, validation can be triggered automatically using several configuration values at the Controller level:

- `validateOnChange`
- `validateOnBlur`
- `validateOnMount`

## todo: Types of Validation

- Built-in: The Form-level Validator
- Built-in: The Field-level Validator
- Third-party validators: Yup

## todo: Managing validation programmatically

- Form-level
- Field-level

## When Does Validation Run?

You can control when Formik runs validation by changing the values of `<Formik validateOnChange>` and/or `<Formik validateOnBlur>` props depending on your needs. By default, Formik will run validation methods as follows:

**After "change" events/methods** (things that update`values`)

- `handleChange`
- `setFieldValue`
- `setValues`

**After "blur" events/methods** (things that update `touched`)

- `handleBlur`
- `setTouched`
- `setFieldTouched`

**Whenever submission is attempted**

- `handleSubmit`
- `submitForm`

There are also imperative helper methods provided to you via Formik's render/injected props which you can use to imperatively call validation.

- `validateForm`
- `validateField`

## Displaying Error Messages

Error messages are dependent on the form's validation. If an error exists, and the validation function produces an error object (as it should) with a matching shape to our values/initialValues, dependent field errors can be accessed from the errors object.

```js
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const DisplayingErrorMessagesSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const DisplayingErrorMessagesExample = () => (
  <div>
    <h1>Displaying Error Messages</h1>
    <Formik
      initialValues={{
        username: '',
        email: '',
      }}
      validationSchema={DisplayingErrorMessagesSchema}
      onSubmit={values => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="username" />
          {/* If this field has been touched, and it contains an error, display it
           */}
          {touched.username && errors.username && <div>{errors.username}</div>}
          <Field name="email" />
          {/* If this field has been touched, and it contains an error, display
          it */}
          {touched.email && errors.email && <div>{errors.email}</div>}
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  </div>
);
```

> The [ErrorMessage](https://jaredpalmer.com/formik/docs/api/errormessage) component can also be used to display error messages.

## Frequently Asked Questions

<details>
<summary>How do I determine if my form is validating?</summary>

If `isValidating` prop is `true`

</details>

<details>
<summary>Can I return `null` as an error message?</summary>

No. Use `undefined` instead. Formik uses `undefined` to represent empty states. If you use `null`, several parts of Formik's computed props (e.g. `isValid` for example), will not work as expected.

</details>

<details>
<summary>How do I test validation?</summary>

Formik has extensive unit tests for Yup validation so you do not need to test that. However, if you are rolling your own validation functions, you should simply unit test those. If you do need to test Formik's execution you should use the imperative `validateForm` and `validateField` methods respectively.

</details>

- sync
- async
- validateOnBlur vs validateOnChange
- field-level
- form-level
- third-party integrations (link to 3rd party bindings)
