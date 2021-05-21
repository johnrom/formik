import {
    Field,
    FieldAsProps,
    FieldComponentClass,
    FieldComponentProps,
    FieldConfig,
    FieldElements,
    FieldRenderFunction,
    FieldRenderProps,
    Form,
    Formik,
    FormikProvider,
    TypedAsField,
    TypedComponentField,
    useFormik,
    useTypedField
  } from "formik";
  import * as React from "react";

  type BasePerson = {
    name: {
      first: string;
      last: string;
    };
    motto: string;
    nicknames: string[];
    age: number;
    ageOrEmpty: number | "";
    favoriteNumbers: number[];
  };

  interface Person extends BasePerson {
    partner: BasePerson;
    friends: BasePerson[];
  };

  const basePerson: BasePerson = {
    name: {
      first: "",
      last: ""
    },
    motto: "",
    nicknames: [],
    age: 1,
    ageOrEmpty: "",
    favoriteNumbers: []
  };

  const person: Person = {
    ...basePerson,
    partner: basePerson,
    friends: []
  };

  const proplessFC = () => null;
  const propsAnyFC = (props: any) => null;
  const partialPropsFC = (props: { name: string }) => null;
  const propsOnlyExtraFC = (props: { what: true }) => null;

  const asAnyFC = (props: FieldAsProps<any, any>) => null;
  const asNumberFC = <Values,>(props: FieldAsProps<number, Values>) => null;
  const asStringFC: TypedAsField<string> = (props) => null;
  const asNumberExtraFC: TypedAsField<number> = (props) => null;

  const renderAnyFn: FieldRenderFunction<any, any> = (props) => null;
  const renderNumberFN = <Value, Values>(
    props: FieldRenderProps<Value, Values>
  ) => null;

  class PropsAnyClass extends React.Component {
    render() {
      return null;
    }
  }
  class PartialPropsClass extends React.Component<{ name: string }> {
    render() {
      return null;
    }
  }
  class AsNumberClass<Values> extends React.Component<
    FieldAsProps<number, Values>
  > {
    render() {
      return null;
    }
  }
  class ComponentNumberClass extends FieldComponentClass<number> {
    render() {
      return null;
    }
  }

  const CustomNumberFC = <Values extends any, Element extends FieldElements<number, Values>>(
    props: FieldConfig<number, Values, Element>
  ) => {
    const InnerTypedField = useTypedField<Values>();

    return (
      <>
        <InnerTypedField name={props.name} format={(value) => {}} />
        <InnerTypedField name={props.name} as={asNumberFC} />
        <InnerTypedField name={props.name} as={asAnyFC} />
        <InnerTypedField
          name={props.name}
          /** @ts-expect-error value must match `number` */
          as={asStringFC}
        />
      </>
    );
  };

const noopVoid = () => {};

const FormTests = () => {
  const formikTyped = useFormik<Person>({
    initialValues: person,
    onSubmit: noopVoid,
  });
  const formikAny = useFormik<any>({
    initialValues: person,
    onSubmit: noopVoid,
  });

  React.useEffect(() => {
    formikAny.setFieldValue("age", 1);
    formikAny.setFieldValue("age", "");
    formikTyped.setFieldValue("age", 1);
    formikTyped.setFieldValue("ageOrEmpty", 1);
    formikTyped.setFieldValue("age", 1 as number | "");
    formikTyped.setFieldValue("favoriteNumbers.0", 1);

    // @ts-expect-error value should match
    formikTyped.setFieldValue("age", "");
    // @ts-expect-error string is not assignable to PathOf<Person>
    formikTyped.setFieldValue("age" as string, "" as any);

    // not working due to:
    // https://github.com/microsoft/TypeScript/issues/30808
    // @ts-expect-error
    formikTyped.setFieldValue("ageOrEmpty", "");
    // but this works
    formikTyped.setFieldValue<"">("ageOrEmpty", "");
  }, []);

  return (
    <FormikProvider value={formikTyped}>
      <Form>
      </Form>
    </FormikProvider>
  );
};

const FieldTests = (props: FieldConfig<number, Person, "input">) => {
  const TypedField = useTypedField<Person>();

  return (
    <Formik initialValues={person} onSubmit={noopVoid}>
      <Form>
        {/* Default */}
        <Field name="age" />
        <TypedField name="age" />
        <TypedField name="friends.0.name.first" />

        <Field name="aeg" />
        {/* @ts-expect-error name doesn't match PathOf<Values> */}
        <TypedField name="aeg" />
        {/* @ts-expect-error name doesn't match PathOf<Values> */}
        <TypedField name="friends.NOPE.name.first" />

        <Field name="age" format={(value) => {}} />
        <TypedField name="age" format={(value) => {}} />
        {/* @ts-expect-error TypedField must match value */}
        <TypedField name="age" format={(value: string) => {}} />

        <Field name="age" aria-required={true} />
        <TypedField name="age" aria-required={true} />
        <TypedField name="friends.0.name.first" aria-required={true} />

        {/* FieldAsString */}
        <Field name="age" as="select" size={1} />
        <Field name="motto" as="textarea" onClick={event => {}} rows={4} />
        <TypedField name="motto" as="textarea" onClick={event => {}} rows={4} />

        {/* FieldStringComponent */}
        <Field name="age" as="select" onClick={event => {}} />
        <TypedField name="age" as="select" />

        {/* FieldAsComponent */}
        <Field name="age" as={proplessFC} />
        <TypedField name="age" as={proplessFC} />
        <Field name="age" as={propsAnyFC} />
        <TypedField name="age" as={propsAnyFC} />
        <Field name="age" as={PropsAnyClass} />
        <Field name="age" as={partialPropsFC} />
        <Field name="age" as={PartialPropsClass} />

        <Field name="age" as={asAnyFC} />
        <Field name="age" as={asNumberFC} />
        <TypedField name="age" as={asNumberFC} />
        <TypedField name="age" as={asAnyFC} />
        <Field name="age" as={asNumberExtraFC} what={true} />
        <TypedField name="age" as={asNumberExtraFC} what={true} />
        <Field name="age" as={asAnyFC}>
          <div />
        </Field>
        <TypedField name="age" as={asAnyFC}>
          <div />
        </TypedField>
        <Field name="age" as={asNumberFC}>
          <div />
        </Field>
        <TypedField name="age" as={asNumberFC}>
          <div />
        </TypedField>
        <Field name="age" as={AsNumberClass} />
        <TypedField name="age" as={AsNumberClass} />

        <TypedField name="age" as={PropsAnyClass} />
        <TypedField name="age" as={PartialPropsClass} />
        <Field name="age" as={propsOnlyExtraFC} what={true} />
        <TypedField name="age" as={propsOnlyExtraFC} what={true} />

        <TypedField name="age" as={asNumberFC} />
        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" as={AsNumberClass} />

        {/* FieldComponent */}
        <Field name="age" component={proplessFC} />
        <TypedField name="age" component={proplessFC} />
        <Field name="age" component={propsAnyFC} />
        <TypedField name="age" component={propsAnyFC} />
        <Field name="age" component={PropsAnyClass} />
        <Field name="age" component={partialPropsFC} />
        <Field name="age" component={PartialPropsClass} />
        <Field name="age" component={componentAnyFC} />
        <Field name="age" component={componentNumberFC} />
        <TypedField name="age" component={componentNumberFC} />
        <Field name="age" component={componentNumberExtraFC} what={true} />
        <TypedField name="age" component={componentNumberExtraFC} what={true} />
        <Field name="age" component={componentAnyFC}>
          <div />
        </Field>
        <Field name="age" component={componentNumberFC}>
          <div />
        </Field>
        <TypedField name="age" component={componentNumberFC}>
          <div />
        </TypedField>
        <TypedField name="age" component={PropsAnyClass} />
        <TypedField name="age" component={PartialPropsClass} />
        <Field name="age" component={ComponentNumberClass} />
        <TypedField name="age" component={ComponentNumberClass} />

        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" component={componentNumberFC} />
        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" component={ComponentNumberClass} />
        {/* @ts-expect-error ExtraProps is required */}
        <Field name="age" as={asNumberExtraFC} />
        {/* @ts-expect-error ExtraProps is required */}
        <TypedField name="age" as={asNumberExtraFC} />
        {/* @ts-expect-error ExtraProps should match */}
        <Field name="age" as={asNumberExtraFC} what={false} />
        {/* @ts-expect-error ExtraProps should match */}
        <TypedField name="age" as={asNumberExtraFC} what={false} />
        {/* @ts-expect-error ExtraProps is required */}
        <Field name="age" component={componentNumberExtraFC} />
        {/* @ts-expect-error ExtraProps is required */}
        <TypedField name="age" component={componentNumberExtraFC} />
        {/* @ts-expect-error ExtraProps should match */}
        <Field name="age" component={componentNumberExtraFC} what={false} />
        {/* @ts-expect-error ExtraProps should match */}
        <TypedField name="age" component={componentNumberExtraFC} what={false} />

        {/* FieldRender */}
        <Field name="age" render={renderAnyFn} />
        {/* @ts-expect-error render function doesn't have child component */}
        <Field name="age" render={renderAnyFn}>
          <div />
        </Field>

        {/* FieldChildren */}
        <Field name="age" children={renderAnyFn} />
        <Field name="age">{renderAnyFn}</Field>

        {/* Pass-Through Props */}
        <Field<any, any> {...props} />
        <Field {...props} />

        {/* FieldRender */}
        <TypedField name="age" render={renderNumberFN} />
        {/* @ts-expect-error render function doesn't have child component */}
        <TypedField name="age" render={renderNumberFN}>
          <div />
        </TypedField>

        {/* FieldChildren */}
        <TypedField name="age" children={renderNumberFN} />
        <TypedField name="age">{renderNumberFN}</TypedField>

        {/* Pass-Through Props */}
        <TypedField {...props} />

        {/* Custom Fields */}
        <CustomNumberFC<Person> name="age" format={(value) => {}} />
        {/* Untyped Custom Fields can have anything */}
        <CustomNumberFC name="motto" />

        {/* @ts-expect-error should match number */}
        <TypedField name="partner.age" value="" />

        {/* array inference doesn't currently work */}
        {/* @ts-expect-error should match number */}
        <TypedField name="favoriteNumbers.0" value="" />
        {/* @ts-expect-error should match string */}
        <TypedField name="friends.0.name" value={1} />
      </Form>
    </Formik>
  );
};

const AllTests = () => {
  return <>
    <FormTests />
    <FieldTests name="age" />
  </>
}

export default AllTests;
