---
id: overview
title: Overview
description: Formik documentation, tutorial, guides, and examples
---

## Background

Let's face it, forms are really verbose in
[React](https://github.com/facebook/react). To make matters worse, most form
helpers do wayyyy too much magic and often have a significant performance cost
associated with them. Formik is a small library that helps you with the 3 most
annoying parts:

1.  Getting values in and out of form state
2.  Validation and error messages
3.  Handling form submission

By colocating all of the above in one place, Formik will keep things
organized--making testing, refactoring, and reasoning about your forms a breeze.

### Motivation

I ([@jaredpalmer](https://twitter.com/jaredpalmer)) wrote Formik while building a large internal administrative dashboard with
[@eonwhite](https://twitter.com/eonwhite). With around ~30 unique forms, it
quickly became obvious that we could benefit by standardizing not just our input
components but also the way in which data flowed through our forms.

### Why not Redux-Form?

By now, you might be thinking, "Why didn't you just use
[Redux-Form](https://github.com/erikras/redux-form)?" Good question.

1.  According to our prophet Dan Abramov,
    [**form state is inherently ephemeral and local**, so tracking it in Redux (or any kind of Flux library) is unnecessary](https://github.com/reactjs/redux/issues/1287#issuecomment-175351978)
2.  Redux-Form calls your entire top-level Redux reducer multiple times ON EVERY
    SINGLE KEYSTROKE. This is fine for small apps, but as your Redux app grows,
    input latency will continue to increase if you use Redux-Form.
3.  Redux-Form is 22.5 kB minified gzipped (Formik is 12.7 kB)

**My goal with Formik was to create a scalable, performant, form helper with a
minimal API that does the really really annoying stuff, and leaves the rest up
to you.**

---

My talk at React Alicante goes much deeper into Formik's motivation and philosophy, introduces the library (by watching me build a mini version of it), and demos how to build a non-trivial form (with arrays, custom inputs, etc.) using the real thing.

<div className="embed-responsive aspect-ratio-16-9">
  <iframe className="embed-responsive-item" width="600" height="315" src="https://www.youtube.com/embed/oiNtnehlaTo" frameBorder="0" allow="autoplay; encrypted-media" allowFullscreen title="Taming Forms in React - Jared Palmer"></iframe>
</div>

### Influences

Formik started by expanding on
[this little higher order component](https://github.com/jxnblk/rebass-recomposed/blob/master/src/withForm.js)
by [Brent Jackson](https://github.com/jxnblk), some naming conventions from
Redux-Form, and (most recently) the render props approach popularized by
[React-Motion](https://github.com/chenglou/react-motion) and
[React-Router 4](https://github.com/ReactTraining/react-router). Whether you
have used any of the above or not, Formik only takes a few minutes to get
started with.

## Getting Started

You can install Formik with [NPM](https://npmjs.com),
[Yarn](https://yarnpkg.com), or a good ol' `<script>` via
[unpkg.com](https://unpkg.com).

You can also try before you buy with an
**[in-browser playground](#in-browser-playgrounds)**

### Compatibility

Formik is compatible with [React v16.8+](https://reactjs.org/docs/hooks-intro.html) and works with ReactDOM and React Native.

### Installation

This overview assumes you have a website already set up and ready to integrate Formik. For a full guide to creating a new website with Formik, check out [Development Setup](./development-setup).

#### NPM

```sh
npm install formik --save
```

#### Yarn

```sh
yarn add formik
```

#### CDN

If you're not using a module bundler or package manager we also have a global ("UMD") build hosted on the [unpkg.com](https://unpkg.com) CDN. Simply add the following `<script>` tag to the bottom of your HTML file:

```html
<script src="https://unpkg.com/formik/dist/formik.umd.production.min.js"></script>
```

Once you've added this you will have access to Formik via `window.Formik.<Insert_Component_Or_Function_Name_Here>`.

> This setup requires the [React CDN script bundles](https://reactjs.org/docs/cdn-links.html) to be on the page as well.

#### In-browser Playgrounds

You can play with Formik in your web browser with these live online playgrounds.

- [CodeSandbox (ReactDOM)](https://codesandbox.io/s/zKrK5YLDZ)
- [Snack (React Native)](https://snack.expo.io/?dependencies=yup%2Cformik%2Creact-native-paper%2Cexpo-constants&sourceUrl=https%3A%2F%2Fgist.githubusercontent.com%2Fbrentvatne%2F700e1dbf9c3e88a11aef8e557627ce3f%2Fraw%2Feeee57721c9890c1212ac34a4c37707f6354f469%2FApp.js)

## Formik in Action

Formik provides reusable components that do a lot of heavy lifting. Using these components, Formik can often look as simple as:

```tsx file=packages/examples/basic/index.tsx
```

Of course, forms are often more complicated than a few text boxes. In these cases, the same functionality that is used to build Formik's core components is also available to developers to create their own reusable, Formik-connected components.

To get started customizing Formik and creating your own custom components, check out the [tutorial](./tutorial).

## Customizing Formik



## Complementary Packages

As you can see above, validation is left up to you. Feel free to write your own
validators or use a 3rd party library. Personally, I use
[Yup](https://github.com/jquense/yup) for object schema validation. It has an
API that's pretty similar to [Joi](https://github.com/hapijs/joi) /
[React PropTypes](https://github.com/facebook/prop-types) but is small enough
for the browser and fast enough for runtime usage. Because I ❤️ Yup sooo
much, Formik has a special config option / prop for Yup called
[`validationSchema`](./api/formik.md#validationschema-schema----schema) which will
automatically transform Yup's validation errors into a pretty object whose keys
match [`values`](./api/formik.md#values-field-string-any) and
[`touched`](./api/formik.md#touched-field-string-boolean). Anyways, you can
install Yup from npm...

```
npm install yup --save
```

or

```
yarn add yup
```
