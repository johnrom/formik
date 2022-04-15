---
id: development-setup
title: Setting up a Development Environment
description: Formik documentation, tutorial, guides, and examples
---

Setting up a Development Environment involves a little more than just the workings of Formik. Here, we'll use Create React App to create an out-of-the-box environment to start working with Formik.

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/) installed.
1. Follow the [installation instructions for Create React App](https://create-react-app.dev) to make a new project.

```bash
npx create-react-app my-app
```

1. Install Formik

```bash
npm i formik
```

Or

```bash
yarn add formik
```

1. Delete all files in the `src/` folder of the new project

> Note:
>
> **Don’t delete the entire `src` folder, just the original source files inside it.** We’ll replace the default source files with examples for this project in the next step.

```bash
cd my-app
cd src

# If you’re using a Mac or Linux:
rm -f *

# Or, if you’re on Windows:
del *

# Then, switch back to the project folder
cd ..
```

5. Add a file named `styles.css` in the `src/` folder with [this CSS code](https://codesandbox.io/s/formik-v2-tutorial-start-s04yr?file=/src/styles.css).

6. Add a file named `index.js` in the `src/` folder with [this JS code](https://codesandbox.io/s/formik-v2-tutorial-start-s04yr?file=/src/index.js:0-759).

Now run `npm start` in the project folder and open `http://localhost:3000` in the browser. You should see an email input and a submit button.

We recommend following [these instructions](https://babeljs.io/docs/editors/) to configure syntax highlighting for your editor.

</details>

### Help, I’m Stuck!

If you get stuck, check out Formik’s [GitHub Discussions](https://github.com/formik/formik/discussions). In addition, the [Formium Community Discord Server](https://discord.gg/pJSg287) is a great way to get help quickly too. If you don’t receive an answer, or if you remain stuck, please file an issue, and we’ll help you out.
