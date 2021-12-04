---
id: deep-dive
title: A Deep Dive into Formik
description: Learn how to build forms in React with Formik.
---

## Before we start

Welcome to the Formik tutorial. This will teach you everything you need to know to build simple forms in React.

If you’re impatient and just want to start hacking on your machine locally, check out [the 60-second quickstart](./overview#getting-started). If you're looking for a deeper knowledge of Formik, check out the [deep dive](./deep-dive).

### What are we building?

In this tutorial, we’ll build a newsletter signup form with React and Formik. We'll rely mostly on the starter components provided by Formik, creating our own custom Field components where necessary.

You can see what we’ll be building here: [Final Result](https://codesandbox.io/s/formik-v2-tutorial-final-ge1pt). If the code doesn’t make sense to you, don’t worry! The goal of this tutorial is to help you understand Formik.

## Setting Up

There are two ways to complete this tutorial: you can either write the code in your browser, or you can set up a local development environment on your computer.

### Using a Playground

This is the quickest way to get started!

First, open this [Starter Code](https://codesandbox.io/s/formik-v2-tutorial-start-s04yr) in a new tab. The new tab should display an email address input, a submit button, and some React code. We’ll be editing the React code in this tutorial.

Continue to [What is Formik?](#overview-what-is-formik)

### Using a local development environment.

To set up your own development environment, including setting up Create React App and running a local server, check out [Development Setup](development-setup).

This is completely optional and not required for this tutorial! To get started quickly, try [Using a Playground](#using-a-playground).

## What is Formik?

Formik is a small group of React components, hooks and helpers for building forms in React and React Native. It helps with the three most annoying parts:

1.  Getting values in and out of form state
2.  Validation and error messages
3.  Handling form submission

By colocating all of the above in one place, Formik keeps things
organized--making testing, refactoring, and reasoning about your forms a breeze.

At its core, Formik is composed of two major parts: state, and an API to access and manipulate that state. The starter components that come with Formik help to tuck the implementation details out of sight until you need them.

## Anatomy of a basic Formik App

We're going to start with our simple app from the [Overview](./overview#formik-in-action) and explore how Formik's helper components use the API to manage Formik's state, building our own Reusable Components in the process.

Imagine we want to add a newsletter signup form for a blog. To start, our form will have just one field named `email`. To get started with Formik, this is just a few lines of code.

```tsx file=packages/examples/basic/basic-example.tsx
```

As you can see, we're starting with 4 main components from Formik, which are automagically connected and ready for user interaction:

- `<Formik />`
  - `<Form />`
    - `<Field />`
    - `<ErrorMessage />`

Let's see how these components come together to create a usable form.

## The Formik API

Formik's API works with a hook, `useFormik()`, which returns an API, and a React Context which passes that API down through React's component hierarchy. Child components access this context by using `useFormikContext()`. Let's try it by replacing the `<Formik />` and `<Form />` components with reusable components that do (just about) the same thing:

```tsx file=packages/examples/basic/basic-example-use-formik.tsx snippet=use-formik-hooks
```

Above, you can see we used the API method `handleSubmit` in order to handle html form submission. Other API methods include `setValues`, `setFieldValue`, `getState()`, and more. [Click here to read more about the Formik API](./api).

In order to actually submit the form, however, the handleSubmit function must know the latest state of the values within Formik, and access Formik State.

## Formik State

Formik State is an immutable object that is replaced entirely when it is updated, similar to how Redux and other Reducers work. It works similar to using `react-redux`, but instead of applying to the whole app, it is scoped to the component which calls `useFormik()`.

Every time the state is updated, it notifies React of that update via `setState` to trigger a new render when necessary.

[Click here to find out more about Formik's state](./guides/accessing-state).

### Using Formik State

We've seen how the API works and is passed down via React Context in order to allow child components to access the API, and now we know that we know the API accesses and manipulates state. How state is accessed is going to be different depending on the situation, so let's look at the three ways to access state in Formik.

#### Accessing state outside of a render

State can be accessed on the fly, outside of a render, similar to how Redux exposes state, using the `getState()` API method. This is useful in event callbacks and setter methods that need to get the result of their actions.

We can replicate what the `handleSubmit` function is doing from our last example using `getState()`:

```tsx file=packages/examples/basic/basic-example-get-state.tsx snippet=getState
```

`getState()` is useful for:

- Event callbacks like `onClick`.
- Effects which need to check the result of their calls to the API.
- Debugging the latest state with `console.log` or breakpoints.

#### Accessing state within a render

State can be accessed from React Context using the `useFormikState` hook or the `formik.useState` API method. This value can be used in hook dependencies and rendered to html. Let's imagine we want to add a `console.log` anytime `formikState` changes. We can achieve this two ways -- either from our `<MyForm />` component or via the root component with `useFormik`.

`useFormikState()` and `formik.useState()` are essentially the same, but used in different places. Most of the time, you'll use `useFormikState()` in child components below Formik's context. However, if you are at the root level, you cannot use React Context -- this is where `formik.useState()` comes in.

`useFormikState()` / `formik.useState()` are useful for:

- Rendering Values to HTML.
- Triggering dependency updates for `useEffect()` and other hooks.

##### Accessing state via React Context with `useFormikState()`.

Accessing Formik's state within a render is possible in components under Formik's React Context by using the `useFormikState` function. This method returns a tuple, and the second value returned is the Formik API. This is a little shortcut for using both state and API methods.

```tsx packages/examples/basic/basic-example-use-formik-state.tsx snippet=useFormikState
```

##### Accessing state directly from the API using `formik.useState()`.

Accessing Formik's state within the component calling `useFormik` is done slightly differently than for child components. This is because the React Context doesn't exist yet!

```tsx packages/examples/basic/basic-example-use-formik-state.tsx snippet=useApiState
```

TODO TODO TODO

### `<Formik />`

`<Formik />` is a helper component which calls `useFormik()` with some default configuration

We’re going to start with the _most verbose_ way of using Formik. While this may seem a bit long-winded, it’s important to see how Formik builds on itself so you have a full grasp of what’s possible and a complete mental model of how it works.

### A simple newsletter signup form


```jsx
import React from 'react';
import { useFormik } from 'formik';

const SignupForm = () => {
  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

We pass our form’s `initialValues` and a submission function (`onSubmit`) to the `useFormik()` hook. The hook then returns to us a goodie bag of form state and helper methods in a variable we call `formik`. For now, the only helper methods we care about are as follows:

- `handleSubmit`: A submission handler
- `handleChange`: A change handler to pass to each `<input>`, `<select>`, or `<textarea>`
- `values`: Our form’s current values

As you can see above, we pass each of these to their respective props...and that’s it! We can now have a working form powered by Formik. Instead of managing our form’s values on our own and writing our own custom event handlers for every single input, we can just use `useFormik()`.

This is pretty neat, but with just one single input, the benefits of using `useFormik()` are unclear. So let’s add two more inputs: one for the user’s first and last name, which we’ll store as `firstName` and `lastName` in the form.

```jsx
import React from 'react';
import { useFormik } from 'formik';

const SignupForm = () => {
  // Note that we have to initialize ALL of fields with values. These
  // could come from props, but since we don’t want to prefill this form,
  // we just use an empty string. If we don’t do this, React will yell
  // at us.
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.lastName}
      />

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

If you look carefully at our new code, you’ll notice some patterns and symmetry _forming_.

1. We reuse the same exact change handler function `handleChange` for each HTML input
2. We pass an `id` and `name` HTML attribute that _matches_ the property we defined in `initialValues`
3. We access the field’s value using the same name (`email` -> `formik.values.email`)

If you’re familiar with building forms with plain React, you can think of Formik’s `handleChange` as working like this:

```jsx
const [values, setValues] = React.useState({});

const handleChange = event => {
  setValues(prevValues => ({
    ...prevValues,
    // we use the name to tell Formik which key of `values` to update
    [event.target.name]: event.target.value
  });
}
```

## Validation

While our contact form works, it’s not quite feature-complete; users can submit it, but it doesn’t tell them which (if any) fields are required.

If we’re okay with using the browser’s built-in HTML input validation, we could add a `required` prop to each of our inputs, specify minimum/maximum lengths (`maxlength` and `minlength`), and/or add a `pattern` prop for regex validation for each of these inputs. These are great if we can get away with them. However, HTML validation has its limitations. First, it only works in the browser! So this clearly is not viable for React Native. Second, it’s hard/impossible to show custom error messages to our user. Third, it’s very janky.

As mentioned earlier, Formik keeps track of not only your form’s `values`, but also its validation and error messages. To add validation with JS, let’s specify a custom validation function and pass it as `validate` to the `useFormik()` hook. If an error exists, this custom validation function should produce an `error` object with a matching shape to our `values`/`initialValues`. Again..._symmetry_...yes...

```jsx
import React from 'react';
import { useFormik } from 'formik';

// A custom validation function. This must return an object
// which keys are symmetrical to our values/initialValues
const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length > 20) {
    errors.lastName = 'Must be 20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

const SignupForm = () => {
  // Pass the useFormik() hook initial form values, a validate function that will be called when
  // form values change or fields are blurred, and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validate,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.firstName}
      />
      {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.lastName}
      />
      {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
      />
      {formik.errors.email ? <div>{formik.errors.email}</div> : null}

      <button type="submit">Submit</button>
    </form>
  );
};
```

`formik.errors` is populated via the custom validation function. By default, Formik will validate after each keystroke (change event), each input’s [blur event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event), as well as prior to submission. The `onSubmit` function we passed to `useFormik()` will be executed only if there are no errors (i.e. if our `validate` function returns `{}`).

## Visited fields

While our form works, and our users see each error, it’s not a great user experience for them. Since our validation function runs on each keystroke against the _entire_ form’s `values`, our `errors` object contains _all_ validation errors at any given moment. In our component, we’re just checking if an error exists and then immediately showing it to the user. This is awkward since we’re going to show error messages for fields that the user hasn’t even visited yet. Most of the time, we only want to show a field’s error message _after_ our user is done typing in that field.

Like `errors` and `values`, Formik keeps track of which fields have been visited. It stores this information in an object called `touched` that also mirrors the shape of `values`/`initialValues`. The keys of `touched` are the field names, and the values of `touched` are booleans `true`/`false`.

To take advantage of `touched`, we pass `formik.handleBlur` to each input’s `onBlur` prop. This function works similarly to `formik.handleChange` in that it uses the `name` attribute to figure out which field to update.

```jsx
import React from 'react';
import { useFormik } from 'formik';

const validate = values => {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length > 20) {
    errors.lastName = 'Must be 20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validate,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.errors.email ? <div>{formik.errors.email}</div> : null}

      <button type="submit">Submit</button>
    </form>
  );
};
```

Almost there! Now that we’re tracking `touched`, we can now change our error message render logic to _only_ show a given field’s error message if it exists _and_ if our user has visited that field.

```jsx
import React from 'react';
import { useFormik } from 'formik';

const validate = values => {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'Required';
  } else if (values.firstName.length > 15) {
    errors.firstName = 'Must be 15 characters or less';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  } else if (values.lastName.length > 20) {
    errors.lastName = 'Must be 20 characters or less';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validate,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Schema Validation with Yup

As you can see above, validation is left up to you. Feel free to write your own validators or use a 3rd-party helper library. Formik’s authors/a large portion of its users use [Jason Quense](https://github.com/jquense)’s library [Yup](https://github.com/jquense/yup) for object schema validation. Yup has an API that’s similar to [Joi](https://github.com/hapijs/joi) and [React PropTypes](https://github.com/facebook/prop-types), but is also small enough for the browser and fast enough for runtime usage. You can try it out here with this [REPL](https://runkit.com/jquense/yup).

Since Formik authors/users _love_ Yup so much, Formik has a special configuration prop for Yup called `validationSchema` which will automatically transform Yup’s validation errors messages into a pretty object whose keys match `values`/`initialValues`/`touched` (just like any custom validation function would have to). Anyways, you can install Yup from NPM/yarn like so...

```bash
npm install yup --save

# or via yarn

yarn add yup
```

To see how Yup works, let’s get rid of our custom validation function `validate` and re-write our validation with Yup and `validationSchema`:

```jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
};
```

Again, Yup is 100% optional. However, we suggest giving it a try. As you can see above, we expressed the exact same validation function with just 10 lines of code instead of 30. One of Formik’s core design principles is to help you stay organized. Yup definitely helps a lot with this--schemas are extremely expressive, intuitive (since they mirror your values), and reusable. Whether or not you use Yup, we highly recommended you share commonly used validation methods across your application. This will ensure that common fields (e.g. email, street addresses, usernames, phone numbers, etc.) are validated consistently and result in a better user experience.

## Reducing Boilerplate

### `getFieldProps()`

The code above is very explicit about exactly what Formik is doing. `onChange` -> `handleChange`, `onBlur` -> `handleBlur`, and so on. However, to save you time, `useFormik()` returns a helper method called `formik.getFieldProps()` to make it faster to wire up inputs. Given some field-level info, it returns to you the exact group of `onChange`, `onBlur`, `value`, `checked` for a given field. You can then spread that on an `input`, `select`, or `textarea`.

```jsx
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        type="text"
        {...formik.getFieldProps('firstName')}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}

      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" type="text" {...formik.getFieldProps('lastName')} />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}

      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" {...formik.getFieldProps('email')} />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Leveraging React Context

Our code above is again very explicit about exactly what Formik is doing. `onChange` -> `handleChange`, `onBlur` -> `handleBlur`, and so on. However, we still have to manually pass each input this "prop getter" `getFieldProps()`. To save you even more time, Formik comes with [React Context](https://reactjs.org/docs/context.html)-powered API/components to make life easier and code less verbose: `<Formik />`, `<Form />`, `<Field />`, and `<ErrorMessage />`. More explicitly, they use React Context implicitly to connect with the parent `<Formik />` state/methods.

Since these components use React Context, we need to render a [React Context Provider](https://reactjs.org/docs/context.html#contextprovider) that holds our form state and helpers in our tree. If you did this yourself, it would look like:

```jsx
import React from 'react';
import { useFormik } from 'formik';

// Create empty context
const FormikContext = React.createContext({});

// Place all of what’s returned by useFormik into context
export const Formik = ({ children, ...props }) => {
  const formikStateAndHelpers = useFormik(props);
  return (
    <FormikContext.Provider value={formikStateAndHelpers}>
      {typeof children === 'function'
        ? children(formikStateAndHelpers)
        : children}
    </FormikContext.Provider>
  );
};
```

Luckily, we’ve done this for you in a `<Formik>` component that works just like this.

Let’s now swap out the `useFormik()` hook for Formik’s `<Formik>` component/render-prop. Since it’s a component, we’ll convert the object passed to `useFormik()` to JSX, with each key becoming a prop.

```jsx
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '' }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {formik => (
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            {...formik.getFieldProps('firstName')}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div>{formik.errors.firstName}</div>
          ) : null}

          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            {...formik.getFieldProps('lastName')}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div>{formik.errors.lastName}</div>
          ) : null}

          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" {...formik.getFieldProps('email')} />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}

          <button type="submit">Submit</button>
        </form>
      )}
    </Formik>
  );
};
```

As you can see above, we swapped out `useFormik()` hook and replaced it with the `<Formik>` component. The `<Formik>` component accepts a function as its children (a.k.a. a [render prop](https://reactjs.org/docs/render-props.html)). Its argument is the _exact_ same object returned by `useFormik()` (in fact, `<Formik>` calls `useFormik()` internally!). Thus, our form works the same as before, except now we can use new components to express ourselves in a more concise manner.

```jsx
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupForm = () => {
  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '' }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      <Form>
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" type="text" />
        <ErrorMessage name="firstName" />

        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text" />
        <ErrorMessage name="lastName" />

        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};
```

The `<Field>` component by default will render an `<input>` component that, given a `name` prop, will implicitly grab the respective `onChange`, `onBlur`, `value` props and pass them to the element as well as any props you pass to it. However, since not everything is an input, `<Field>` also accepts a few other props to let you render whatever you want. Some examples..

```jsx
// <input className="form-input" placeHolder="Jane"  />
<Field name="firstName" className="form-input" placeholder="Jane" />

// <textarea className="form-textarea"/></textarea>
<Field name="message" as="textarea" className="form-textarea" />

// <select className="my-select"/>
<Field name="colors" as="select" className="my-select">
  <option value="red">Red</option>
  <option value="green">Green</option>
  <option value="blue">Blue</option>
</Field>
```

React is all about composition, and while we’ve cut down on a lot of the [prop-drilling](https://kentcdodds.com/blog/prop-drilling), we’re still repeating ourselves with a `label`, `<Field>`, and `<ErrorMessage>` for each of our inputs. We can do better with an abstraction! With Formik, you can and should build reusable input primitive components that you can share around your application. Turns out our `<Field>` render-prop component has a sister and her name is `useField` that’s going to do the same thing, but via React Hooks! Check this out...

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

const MyCheckbox = ({ children, ...props }) => {
  // React treats radios and checkbox inputs differently other input types, select, and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className="checkbox-input">
        <input type="checkbox" {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

// And now we can use these
const SignupForm = () => {
  return (
    <>
      <h1>Subscribe!</h1>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          acceptedTerms: false, // added for our checkbox
          jobType: '', // added for our select
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          acceptedTerms: Yup.boolean()
            .required('Required')
            .oneOf([true], 'You must accept the terms and conditions.'),
          jobType: Yup.string()
            .oneOf(
              ['designer', 'development', 'product', 'other'],
              'Invalid Job Type'
            )
            .required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form>
          <MyTextInput
            label="First Name"
            name="firstName"
            type="text"
            placeholder="Jane"
          />

          <MyTextInput
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
          />

          <MyTextInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@formik.com"
          />

          <MySelect label="Job Type" name="jobType">
            <option value="">Select a job type</option>
            <option value="designer">Designer</option>
            <option value="development">Developer</option>
            <option value="product">Product Manager</option>
            <option value="other">Other</option>
          </MySelect>

          <MyCheckbox name="acceptedTerms">
            I accept the terms and conditions
          </MyCheckbox>

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
};
```

As you can see above, `useField()` gives us the ability to connect any kind input of React component to Formik as if it were a `<Field>` + `<ErrorMessage>`. We can use it to build a group of reusable inputs that fit our needs.

## Wrapping Up

Congratulations! You’ve created a signup form with Formik that:

- Has complex validation logic and rich error messages
- Properly displays errors messages to the user at the correct time (after they have blurred a field)
- Leverages your own custom input components you can use on other forms in your app

Nice work! We hope you now feel like you have a decent grasp on how Formik works.

Check out the final result here: [Final Result](https://codesandbox.io/s/formik-v2-tutorial-final-ge1pt).

If you have extra time or want to practice your new Formik skills, here are some ideas for improvements that you could make to the signup form which are listed in order of increasing difficulty:

- Disable the submit button while the user has attempted to submit (hint: `formik.isSubmitting`)
- Add a reset button with `formik.handleReset` or `<button type="reset">`.
- Pre-populate `initialValues` based on URL query string or props passed to `<SignupForm>`.
- Change the input border color to red when a field has an error and isn’t focused
- Add a shake animation to each field when it displays an error and has been visited
- Persist form state to the browser’s [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) so that form progress is kept in between page refreshes

Throughout this tutorial, we touched on Formik concepts including form state, fields, validation, hooks, render props, and React context. For a more detailed explanation of each of these topics, check out the rest of the [documentation](./overview). To learn more about defining the components and hooks in the tutorial, check out the [API reference](./api/formik).
