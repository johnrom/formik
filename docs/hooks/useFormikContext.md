---
id: useFormikContext
title: useFormikContext()
---

`useFormikContext()` is a React hook that will return the [Formik Api](../api) via [React Context](https://reactjs.org/docs/context.html).

> The old `AutoSubmitToken` example has been modernized and moved to [`useState`](../api/useState).

## Example

Here's an example of using Formik's context in order to get the submit handler:

```tsx file=packages/examples/basic/basic-example-use-formik.tsx snippet=useFormikContext

```

## Reference

### `useFormikContext(): FormikProps<Values>`

A custom React Hook that returns Formik states and helpers via React Context. Thus, this hook will only work if there is a parent Formik React Context from which it can pull from. If called without a parent context (i.e. a descendent of a `<Formik>` component or `withFormik` higher-order component), you will get a warning in your console.
