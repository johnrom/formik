---
id: state
title: Formik's State
---

### Accessing Formik State

In Formik there are three methods of accessing state:

- [formik.getState](../api/getState) - Get the latest state from the API.
- [useFormikState](../hooks/useFormikState) - Get Formik's state for this render.
- [formik.useState](../api/useState) - Get Formik's state for this render, used when you do not have access to Context, but only to `useFormik()`.
