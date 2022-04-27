---
title: Form Submission
---

## todo: Submitting a Form

- handleSubmit
- submitForm

## todo: Overview of process

- Set all fields touched
- Run all validators
- Increment `formState.submitCount`
- Set `formState.isSubmitting` to `true`
- Validate form
  - Set `isValidating` to `true`
  - Run all field-level validations, `validate`, and `validationSchema` asynchronously and deeply merge results
  - Are there any errors?
    - Yes: Abort submission. Set `isValidating` to `false`, set `errors`, set `isSubmitting` to `false`
    - No: Set `isValidating` to `false`
- Run `onSubmit` callback.

## todo: scenarios from examples

- blocking submission during submission
- showing errors when touched or submitted
