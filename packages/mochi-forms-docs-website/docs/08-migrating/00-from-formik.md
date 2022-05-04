---
title: Migrating from Formik
---

todo: not much to do for the initial migration, but there is plenty to do to optimize and use `mochi-forms` the way it is intended.

- choose the proper helper for each scenario: helper component, hook, or higher-order component
  - see Helpers
- `isInitialValid` has been removed. Use `initialErrors` instead.
- `formApi.handleChange` has been removed because it was not type safe. Migration path TBD. useFieldProps, FieldProps, withFieldProps or something.
  - need to make the migration path equally as simple in React Native
