import { Compiler } from 'webpack';

export type FormikWebpackPluginOptions = {
  concurrent?: boolean;
};

const concurrentPackage = '@formik/react-mutable-source';
const nonConcurrentPackages = [
  '@formik/react-context-selector',
  '@formik/react-subscriptions',
];

/**
 * If we are requesting a Concurrent Version of Formik,
 * rewrite requests to Sync Versions of Formik to `@formik/react-mutable-source`
 */
export class FormikWebpackPlugin {
  private options: FormikWebpackPluginOptions;

  constructor(options: FormikWebpackPluginOptions) {
    const { concurrent = false } = options;

    this.options = {
      concurrent,
    };
  }

  apply(compiler: Compiler) {
    /**
     * Rewriting the config this way works,
     * unless you're using `tsconfig-paths-webpack-plugin`
     * or another plugin which rewrites your paths.
     *
     * So... it doesn't work for the dev app.
     */
    if (this.options.concurrent) {
      if (Array.isArray(compiler.options.resolve.alias)) {
        const aliasArrayConfig = [...compiler.options.resolve.alias];
        nonConcurrentPackages.forEach(packageToReplace => {
          if (
            !aliasArrayConfig.find(alias => alias.name === packageToReplace)
          ) {
            aliasArrayConfig.push({
              name: packageToReplace,
              alias: concurrentPackage,
            });
          }
        });
        compiler.options.resolve.alias = aliasArrayConfig;
      } else {
        const aliasObjConfig = compiler.options.resolve.alias
          ? { ...compiler.options.resolve.alias }
          : {};
        nonConcurrentPackages.forEach(packageToReplace => {
          if (typeof aliasObjConfig[packageToReplace] === 'undefined') {
            aliasObjConfig[packageToReplace] = concurrentPackage;
          }
        });
        compiler.options.resolve.alias = aliasObjConfig;
      }
    }
  }
}
