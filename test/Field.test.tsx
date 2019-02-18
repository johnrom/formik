import * as React from 'react';
import { cleanup, render, wait } from 'react-testing-library';
import {
  Formik,
  Field,
  FastField,
  FieldProps,
  FieldConfig,
  FastFieldConfig,
  FormikProps,
  FormikConfig,
  FastFieldProps,
} from '../src';

import { noop } from './testHelpers';

const initialValues = {
  name: 'jared',
  email: 'hello@reason.nyc',
  user: { superPowers: ['Surging', 'Binding'] },
};
type Values = typeof initialValues;

function renderForm(
  ui?: React.ReactNode,
  props?: Partial<FormikConfig<Values>>
) {
  let injected: FormikProps<Values>;

  return {
    getFormProps(): FormikProps<Values> {
      return injected;
    },
    ...render(
      <Formik onSubmit={noop} initialValues={initialValues} {...props}>
        {(formikProps: FormikProps<Values>) =>
          (injected = formikProps) && ui ? ui : null
        }
      </Formik>
    ),
  };
}

const createRenderField = (FieldComponent: typeof Field) => (
  props: Partial<FieldConfig> | Partial<FastFieldConfig> = {},
  formProps?: Partial<FormikConfig<Values>>
) => {
  let injected: FieldProps | FastFieldProps;

  if (!props.children && !props.render && !props.component) {
    props.children = (fieldProps: FieldProps | FastFieldProps) =>
      (injected = fieldProps) && null;
  }

  return {
    getProps() {
      return injected;
    },
    ...renderForm(<FieldComponent name="name" {...props} />, formProps),
  };
};

const renderField = createRenderField(Field);
const renderFastField = createRenderField(FastField);

function cases(
  title: string,
  tester: (arg: typeof renderField | typeof renderFastField) => void
) {
  describe(title, () => {
    it('<Field />', async () => Promise.resolve(tester(renderField)));
    it('<FastField />', async () => Promise.resolve(tester(renderFastField)));
  });
}

const TEXT = 'Mrs. Kato';

describe('Field / FastField', () => {
  afterEach(cleanup);

  describe('renders an <input /> by default', () => {
    it('<Field />', () => {
      const { container } = renderForm(<Field name="name" />);
      expect(container.querySelectorAll('input')).toHaveLength(1);
    });

    it('<FastField />', () => {
      const { container } = renderForm(<FastField name="name" />);
      expect(container.querySelectorAll('input')).toHaveLength(1);
    });
  });

  describe('receives { field, form } props and renders element', () => {
    it('<Field />', () => {
      let injected: FieldProps[] = [];

      const Component: React.FunctionComponent<FieldProps> = props => {
        injected.push(props);

        return <div data-testid="child">{TEXT}</div>;
      };

      const { getFormProps, queryAllByText } = renderForm(
        <>
          <Field name="name" children={Component} />
          <Field name="name" render={Component} />
          <Field name="name" component={Component} />
        </>
      );

      injected.forEach(injectedProps => {
        const {
          formik: { Fields: InjectedFields, ...injectedForm },
          field: injectedField,
        } = injectedProps;
        const { Fields, ...formProps } = getFormProps();
        const { handleBlur, handleChange } = formProps;
        expect(injectedField.name).toBe('name');
        expect(injectedField.value).toBe('jared');
        expect(injectedField.onChange).toBe(handleChange);
        expect(injectedField.onBlur).toBe(handleBlur);
        expect(injectedForm).toEqual(formProps);
      });

      expect(queryAllByText(TEXT)).toHaveLength(3);
    });

    it('<FastField />', () => {
      let injected: FastFieldProps[] = [];

      const Component = (props: FastFieldProps) => {
        injected.push(props);

        return <div>{TEXT}</div>;
      };

      const { getFormProps, queryAllByText } = renderForm(
        <>
          <FastField name="name" children={Component} />
          <FastField name="name" render={Component} />
          <FastField name="name" component={Component} />
        </>
      );

      injected.forEach(injectedProps => {
        const {
          formik: { Fields: InjectedFields, ...injectedForm },
          field: injectedField,
        } = injectedProps;
        const { Fields, ...formProps } = getFormProps();
        const { handleBlur, handleChange } = formProps;
        expect(injectedField.name).toBe('name');
        expect(injectedField.value).toBe('jared');
        expect(injectedField.onChange).toBe(handleChange);
        expect(injectedField.onBlur).toBe(handleBlur);
        expect(injectedForm).toEqual(formProps);
      });

      expect(queryAllByText(TEXT)).toHaveLength(3);
    });
  });

  describe('children', () => {
    cases('renders a child element', () => {
      const { container } = renderForm(
        <Field name="name" component="select">
          <option value="Jared" label={TEXT} />
          <option value="Jared" label={TEXT} />
        </Field>
      );

      expect(container.querySelectorAll('option')).toHaveLength(2);
    });
  });

  describe('component', () => {
    cases('renders string components', renderField => {
      const { container } = renderField({
        component: 'textarea',
      });

      expect(container.firstChild.type).toBe('textarea');
    });

    cases('assigns innerRef as a ref to string components', renderField => {
      const innerRef = jest.fn();
      const { container } = renderField({
        innerRef,
        component: 'input',
      });

      expect(innerRef).toHaveBeenCalledWith(container.firstChild);
    });

    cases('forwards innerRef to React component', renderField => {
      let injected: any; /** FieldProps ;) */
      const Component = (props: FieldProps) => (injected = props) && null;

      const innerRef = jest.fn();
      renderField({ component: Component, innerRef });
      expect(injected.innerRef).toBe(innerRef);
    });
  });

  describe('validate', () => {
    cases('calls validate during onChange if present', renderField => {
      const validate = jest.fn();
      const { getProps } = renderField({ validate });

      getProps().field.onChange({ target: { name: 'name', value: 'hello' } });
      expect(validate).toHaveBeenCalled();
    });

    cases(
      'does NOT call validate during onChange if validateOnChange is set to false',
      renderField => {
        const validate = jest.fn();
        const { getProps } = renderField(
          { validate },
          { validateOnChange: false }
        );

        getProps().field.onChange({ target: { name: 'name', value: 'hello' } });
        expect(validate).not.toHaveBeenCalled();
      }
    );

    cases('calls validate during onBlur if present', renderField => {
      const validate = jest.fn();
      const { getProps } = renderField({ validate });

      getProps().field.onBlur({ target: { name: 'name', value: 'hello' } });
      expect(validate).toHaveBeenCalled();
    });

    cases(
      'does NOT call validate during onBlur if validateOnBlur is set to false',
      renderField => {
        const validate = jest.fn();
        const { getProps } = renderField(
          { validate },
          { validateOnBlur: false }
        );

        getProps().field.onBlur({ target: { name: 'name', value: 'hello' } });
        expect(validate).not.toHaveBeenCalled();
      }
    );

    cases(
      'runs validation when validateField is called (SYNC)',
      async renderField => {
        const validate = jest.fn(() => 'Error!');
        const { getFormProps } = renderField({ validate });

        getFormProps().validateField('name');

        expect(validate).toHaveBeenCalled();
        await wait(() => expect(getFormProps().errors.name).toBe('Error!'));
      }
    );

    cases(
      'runs validation when validateField is called (ASYNC)',
      async renderField => {
        const validate = jest.fn(() => Promise.reject('Error!'));
        const { getFormProps } = renderField({ validate });

        getFormProps().validateField('name');

        expect(validate).toHaveBeenCalled();
        await wait(() => expect(getFormProps().errors.name).toBe('Error!'));
      }
    );
  });

  describe('warnings', () => {
    cases(
      'warns if both string component and children as a function',
      renderField => {
        global.console.warn = jest.fn();

        renderField({
          component: 'select',
          children: () => <option value="Jared">{TEXT}</option>,
        });

        expect((global.console.warn as jest.Mock).mock.calls[0][0]).toContain(
          'Warning:'
        );
      }
    );

    cases(
      'warns if both non-string component and children children as a function',
      renderField => {
        global.console.warn = jest.fn();

        renderField({
          component: () => null,
          children: () => <option value="Jared">{TEXT}</option>,
        });

        expect((global.console.warn as jest.Mock).mock.calls[0][0]).toContain(
          'Warning:'
        );
      }
    );

    cases('warns if both string component and render', renderField => {
      global.console.warn = jest.fn();

      renderField({
        component: 'textarea',
        render: () => <option value="Jared">{TEXT}</option>,
      });

      expect((global.console.warn as jest.Mock).mock.calls[0][0]).toContain(
        'Warning:'
      );
    });

    cases('warns if both non-string component and render', renderField => {
      global.console.warn = jest.fn();

      renderField({
        component: () => null,
        render: () => <option value="Jared">{TEXT}</option>,
      });

      expect((global.console.warn as jest.Mock).mock.calls[0][0]).toContain(
        'Warning:'
      );
    });

    cases('warns if both children and render', renderField => {
      global.console.warn = jest.fn();

      renderField({
        children: <div>{TEXT}</div>,
        render: () => <div>{TEXT}</div>,
      });

      expect((global.console.warn as jest.Mock).mock.calls[0][0]).toContain(
        'Warning:'
      );
    });
  });

  cases('can resolve bracket paths', renderField => {
    const { getProps } = renderField(
      { name: 'user[superPowers][0]' },
      { initialValues }
    );

    expect(getProps().field.value).toBe('Surging');
  });

  cases('can resolve mixed dot and bracket paths', renderField => {
    const { getProps } = renderField(
      { name: 'user.superPowers[1]' },
      { initialValues }
    );

    expect(getProps().field.value).toBe('Binding');
  });

  cases('can resolve mixed dot and bracket paths II', renderField => {
    const { getProps } = renderField(
      { name: 'user[superPowers].1' },
      { initialValues }
    );

    expect(getProps().field.value).toBe('Binding');
  });
});

describe('<FastField />', () => {
  it('does NOT forward shouldUpdate to React component', () => {
    let injected: any;
    const Component = (props: FieldProps) => (injected = props) && null;

    const shouldUpdate = () => true;
    renderFastField({ component: Component, shouldUpdate });
    expect(injected.shouldUpdate).toBe(undefined);
  });
});
