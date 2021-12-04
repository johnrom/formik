---
id: deep-dive
title: A Deep Dive into Formik
description: Learn how to build forms in React with Formik.
---

## Before we start

Welcome to the Formik deep dive. Here, we will learn everything we need to know about the inner workings of Formik and get prepared to extend and customize Formik.

If you’re impatient and just want to start hacking on your machine locally, check out [the 60-second quickstart](./overview#getting-started). If you just want a quick tutorial on using Formik out of the box, check out the [tutorial](./tutorial).

### What are we building?

In this tutorial, we’ll build a complex newsletter signup form with React and Formik. We'll be following the tutorial -- first, using the starter components provided by Formik and gradually customizing Formik with our own custom components, effects, and API methods.

You can see what we’ll be building here: [Final Result](https://codesandbox.io/s/formik-v2-tutorial-final-ge1pt). If the code doesn’t make sense to you, don’t worry! The goal of this tutorial is to help you understand Formik.

### Prerequisites

You’ll need to have familiarity with HTML, CSS, [modern JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), [React](https://reactjs.org), and [React Hooks](https://reactjs.org/docs/hooks-intro.html) to fully understand Formik and how it works. In this tutorial, we’ll be using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), [computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names), and [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) . You can use the [Babel REPL](https://babeljs.io/repl/#?presets=react&code_lz=MYewdgzgLgBApgGzgWzmWBeGAeAFgRgD4AJRBEAGhgHcQAnBAEwEJsB6AwgbgChRJY_KAEMAlmDh0YWRiGABXVOgB0AczhQAokiVQAQgE8AkowAUAcjogQUcwEpeAJTjDgUACIB5ALLK6aRklTRBQ0KCohMQk6Bx4gA) to check what ES6 code compiles to.

## Setting Up

You can follow along with the deep dive similar to the [tutorial](./tutorial#setting-up):

- [Use a Playground](https://codesandbox.io/s/formik-v2-tutorial-start-s04yr) in a new tab.
- [Use a local development environment](./development-setup).

If it is your first time building a React site, using a local environment may be a little advanced. However, if you've followed the tutorial and made it this far, you may want to explore setting up a development environment before digging deep into Formik.

## Anatomy of a basic Formik App

We're going to follow the [Tutorial](./tutorial) and explore how Formik's helper components use the API to manage Formik's state -- building our own Reusable Components in the process.

Imagine we want to add a newsletter signup form for a blog. To start, our form will have just one field named `email`. To get started with Formik, this is just a few lines of code.

```tsx file=packages/examples/tutorial/tutorial-start.tsx
```

As you can see, we're starting with 4 main components from Formik, which are automagically connected and ready for user interaction:

- `<Formik />`
  - `<Form />`
    - `<Field />`
    - `<ErrorMessage />`

Let's see how these components come together to create a usable form.

## The Formik API

Formik's API works with a hook, `useFormik()`, which returns an API, and a React Context which passes that API down through React's component hierarchy. Child components access this context by using `useFormikContext()`. Let's try it by replacing the `<Formik />` and `<Form />` components with reusable components that do (just about) the same thing:

```tsx file=packages/examples/tutorial/tutorial-useFormik.tsx snippet=use-formik-hooks
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

```tsx file=packages/examples/tutorial/tutorial-getState.tsx snippet=getState
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

```tsx packages/examples/tutorial/tutorial-useFormikState.tsx snippet=useFormikState
```

##### Accessing state directly from the API using `formik.useState()`.

Accessing Formik's state within the component calling `useFormik` is done slightly differently than for child components. This is because the React Context doesn't exist yet!

```tsx packages/examples/tutorial/tutorial-useFormikState.tsx snippet=useApiState
```

#### Optimizing `state`

As you may have guessed, `useFormikState()` is actually a helpful shortcut for `useFormikContext().useState()`. Both of these methods accept a selector for optimizing the subscription to state. Other parameters include a comparison function, and a boolean to determine whether the change should subscribe and trigger further renders. It is important that the functions passed to these functions are memoized or constant functions, because every time they are updated, the subscription will be recreated, and a render will be triggered in the requesting component.

Let's imagine we want to add a console.log every time `formikState.values` updates.

We can either:

- create a constant function outside of our component:

    ```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=selector
    ```

- or memoize a function within our component:

    ```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=selector-memoized
    ```

At the root level, we can pass the callback to `formik.useState()`. In this example, we will always subscribe to updates since we are always passing a function:

```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=optimizing-formik-useState
```

As a child component, we can also pass the selector to `useFormikState()`. Let's pass the `onChange` function created in the last example to our custom Form component.

```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=using-form-onChange
```

This callback might not always be provided, so we'll also check for the existence of the prop when deciding whether to subscribe:

```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=optimizing-useFormikState
```

##### Using a custom comparison function

The above function will trigger every time `values` is updated, but it is possible for `values` to update even though the values inside it haven't changed. Instead, we can use deep equality via `lodash` to check for an actual change:

```tsx packages/examples/tutorial/tutorial-optimizing-state.tsx snippet=deep-comparison
```

We use this method in `useFieldMeta` to optimize it for when the resulting is updated, but the actual field's `value`, `touched`, and `error` don't change.

##### Optionally subscribing

Optionally subscribing to state is a really interesting workaround for the fact that we cannot violate the rules of hooks by optionally calling `useState`. Instead, we can tell the underlying subscription that we don't care about updates and thus avoid renders. We use this within the `<Formik />` component to provide a highly optimized component by default, but allow users to pass a function as children which is less optimized but always has the latest state. See