---
id: useFormikState
title: useFormikState
---

A hook to access Formik's State within a render. This is the same as `useFormikContext().useState()`.

## Example

Here's an example of a form that works similarly to Stripe's 2-factor verification form. As soon as you type a 6 digit number, the form will automatically submit (i.e. no enter keypress is needed).

```tsx file=packages/examples/auto-submit/AutoSubmitExample.tsx
```
