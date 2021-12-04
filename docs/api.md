---
id: api
title: The Formik API
---

### `handleBlur`

> `(e: any) => void`

`onBlur` event handler. Useful for when you need to track whether an input has
been `touched` or not. This should be passed to `<input onBlur={handleBlur} ... />`

### `handleChange`

> `(e: React.ChangeEvent<any>) => void`

General input change event handler. This will update the `values[key]` where
`key` is the event-emitting input's `name` attribute. If the `name` attribute is
not present, `handleChange` will look for an input's `id` attribute. Note:
"input" here means all HTML inputs.

### `handleReset`

> `() => void`

Reset handler. Will reset the form to its initial state. This should be passed
to `<button onClick={handleReset}>...</button>`

### `handleSubmit`

> `(e: React.FormEvent<HTMLFormElement>) => void`

Submit handler. This should be passed to `<form onSubmit={props.handleSubmit}>...</form>`. To learn more about the submission process, see [Form Submission](../guides/form-submission.md).

### `formik.useState()`

> ```ts
> <Values, Return>(
>   selector: (state: FormikState<Values>) => Return
>   comparer: (prev: Return, next: Return) => boolean
>   shouldSubscribe: boolean
> ) => Return;
> ```

A special hook returned by Formik's API to access Formik's State within a render outside of Formik's context. See more in the [deep dive](./deep-dive#formik-state).

### `formik.getState()`

> ```ts
> <Values>() => FormikState<Values>;
> ```

A method to access Formik's State outside of a render, for example in an event handler. See more in the [deep dive](./deep-dive#formik-state).
