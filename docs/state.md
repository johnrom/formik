---
id: state
title: Formik's State
---

## Accessing Formik State

In Formik there are three methods of accessing state:

- [formik.getState](./api#getState) - Get the latest state from the API.
- [useFormikState](./hooks#useFormikState) - Get Formik's state for this render.
- [formik.useState](./api#useState) - Get Formik's state for this render, used when you do not have access to Context, but only to `useFormik()`.

See more information about using Formik's state in the [deep dive](./deep-dive#formik-state).

## `FormikState`

### `dirty: boolean`

Returns `true` if values are not deeply equal from initial values, `false` otherwise.
`dirty` is a readonly computed property and should not be mutated directly.

### `errors: { [field: string]: string }`

Form validation errors. Should match the shape of your form's `values` defined
in `initialValues`. If you are using `validationSchema` (which you should be),
keys and shape will match your schema exactly. Internally, Formik transforms raw
[Yup validation errors](https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string)
on your behalf. If you are using `validate`, then that function will determine
the `errors` objects shape.

### `isSubmitting: boolean`

Submitting state of the form. Returns `true` if submission is in progress and `false` otherwise. IMPORTANT: Formik will set this to `true` as soon as submission is _attempted_. To learn more about the submission process, see [Form Submission](../guides/form-submission.md).

### `isValid: boolean`

Returns `true` if there are no `errors` (i.e. the `errors` object is empty) and `false` otherwise.

> Note: `isInitialValid` was deprecated in 2.x. However, for backwards compatibility, if the `isInitialValid` prop is specified, `isValid` will return `true` if the there are no `errors`, or the result of `isInitialValid` of the form if it is in "pristine" condition (i.e. not `dirty`).

### `isValidating: boolean`

Returns `true` if Formik is running validation during submission, or by calling [`validateForm`] directly `false` otherwise. To learn more about what happens with `isValidating` during the submission process, see [Form Submission](../guides/form-submission.md).
