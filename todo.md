- Move yup into a separate package, use it by default for backwards compatibility
- Add a default parser and formatter from file to `multiple ? target.files : target.files[0]`. (Make sure formatter always uses undefined, since it's an uncontrolled field)
- `FieldInputProps.value` should be a different type -- the result of `format` / the `value` prop expected by `as={Component}`
- Add File demo.
- `<Formik />` only accepts a single child (Children.Only) ??
- Add original event to `parse` to support `event.target.files`.
- UseOptimizedSelector has a sourcemap issue.
- UseFieldMeta is not properly typed
- Remove requirement of initialValues using the FieldRegistry.
- Simplify the API to just use `as`, and to be very flexible.
- Correctly use `ref` instead of `innerRef`.
- Fix or remove lodash
- Decide what to do with formatOnBlur since it actually breaks type safety. Probably use an inner `Mask` component.
- Maybe add event handlers to Form and Field like `onChange` which react to changes in Formik state
- Document changes to defaultParseFn that will now only work for Input / Select components
- GetValueFromEvent shouldn't break types to use React Native. Devs should instead explicitly map React Native fields to Values.
- ChangeHandlerValue cannot be inferred even though its type will be correctly validated
  ```tsx
  <Field name="strVal" parse={/* event is `unknown` */ event => ''} />
  ```
- Add a double-checked effect for when values have been updated, like:

  ```ts
  export const MyField = ({ name }: { name: string }) => {
    const { setFieldValue } = useFormApi();
    const { value } = useFieldMeta(name);

    useEffect(() => {
      if (value === '') {
        setFieldValue('one');
      }
    }, [value]);

    // create an easy way to check whether this condition is still true
    // so one part of the app doesn't override another part of the app
    useEffect(() => {
      // this is really unwieldy:
      // if (value !== getIn(getState().value, name)) {
      //   return
      // }
      // maybe all the `use` hooks can return a `get` hook?
      // useState => getState (already exists)
      // useFieldMeta, getFieldMeta = (name) => selectFieldMetaFromState(name)(getState())
      // this would also help when validating, to make sure the value is still current
      if (value === '') {
        setFieldValue('two');
      }
    }, [value]);
  };
  ```
