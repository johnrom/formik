
## `useFormikContext()`

`useFormikContext()` is a React hook that will return the [Formik Api](./api) via [React Context](https://reactjs.org/docs/context.html).

> The old `AutoSubmitToken` example has been modernized and moved to [`useState`](#useState).

### `useFormikContext()` Example

Here's an example of using Formik's context in order to get the submit handler:

```tsx file=packages/examples/tutorial/tutorial-use-formik.tsx snippet=useFormikContext

```

### Reference

### `useFormikContext(): FormikProps<Values>`

A custom React Hook that returns Formik states and helpers via React Context. Thus, this hook will only work if there is a parent Formik React Context from which it can pull from. If called without a parent context (i.e. a descendent of a `<Formik>` component or `withFormik` higher-order component), you will get a warning in your console.

## `useFormikState()`

A hook to access Formik's State within a render. This is the same as [`useFormikContext().useState()`](./api#useState).

### `useFormikState()` Example

Here's an example of a form that works similarly to Stripe's 2-factor verification form. As soon as you type a 6 digit number, the form will automatically submit (i.e. no enter keypress is needed).

```tsx file=packages/examples/auto-submit/AutoSubmitExample.tsx
```
